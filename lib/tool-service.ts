const serviceBase = (process.env.NEXT_PUBLIC_TOOL_API_URL ?? 'https://tools.dhebe.com/api/tools').replace(/\/$/, '');

export const serverToolIds = new Set([
  'word-to-pdf', 'powerpoint-to-pdf', 'excel-to-pdf', 'html-to-pdf',
  'pdf-to-word', 'pdf-to-powerpoint', 'pdf-to-excel', 'pdf-to-pdfa', 'protect',
  'repair',
]);

const officeMime = 'application/vnd.openxmlformats-officedocument.';
const outputFormats: Record<string, { mime: string; extension: string }> = {
  ...Object.fromEntries(['word-to-pdf', 'powerpoint-to-pdf', 'excel-to-pdf', 'html-to-pdf', 'pdf-to-pdfa', 'protect', 'repair', 'ocr'].map(tool => [tool, { mime: 'application/pdf', extension: 'pdf' }])),
  'pdf-to-word': { mime: officeMime + 'wordprocessingml.document', extension: 'docx' },
  'pdf-to-powerpoint': { mime: officeMime + 'presentationml.presentation', extension: 'pptx' },
  'pdf-to-excel': { mime: officeMime + 'spreadsheetml.sheet', extension: 'xlsx' },
  'background-remover': { mime: 'image/png', extension: 'png' },
};

export async function convertOnServer(tool: string, file: File, password = '', signal?: AbortSignal) {
  const format = outputFormats[tool];
  if (!format) throw new Error('This conversion tool is unavailable.');
  const form = new FormData();
  form.append('file', file);
  if (password) form.append('password', password);
  const controller = new AbortController();
  const cancel = () => controller.abort();
  let timedOut = false;
  // One deadline covers upload, polling, and reading the final download body.
  const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, 300_000);
  if (signal?.aborted) cancel();
  else signal?.addEventListener('abort', cancel, { once: true });
  try {
    let response = await fetch(`${serviceBase}/jobs/${encodeURIComponent(tool)}`, { method: 'POST', body: form, signal: controller.signal });
    if (response.status === 202) {
      const data = await response.json().catch(() => null);
      const job = data?.job;
      if (typeof job !== 'string' || !/^[A-Za-z0-9_-]+$/.test(job)) throw new Error('Invalid conversion job.');
      do {
        await new Promise<void>((resolve, reject) => {
          const abort = () => { clearTimeout(timer); reject(new DOMException('Cancelled', 'AbortError')); };
          const timer = setTimeout(() => { controller.signal.removeEventListener('abort', abort); resolve(); }, 1000);
          if (controller.signal.aborted) abort();
          else controller.signal.addEventListener('abort', abort, { once: true });
        });
        response = await fetch(`${serviceBase}/jobs/${job}`, { signal: controller.signal, cache: 'no-store' });
      } while (response.status === 202);
    }
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(typeof body?.detail === 'string' ? body.detail : 'The conversion service is unavailable. Please try again later.');
    }
    const type = (response.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase();
    if (type !== format.mime) throw new Error('The conversion service returned an invalid file.');
    const blob = await response.blob();
    if (!blob.size) throw new Error('The conversion service returned an invalid file.');
    const disposition = response.headers.get('content-disposition') ?? '';
    const suppliedName = disposition.match(/filename="([^"\\/\x00-\x1f]+)"/)?.[1];
    const filename = suppliedName?.toLowerCase().endsWith('.' + format.extension)
      ? suppliedName
      : `converted-${file.name.replace(/\.[^.]+$/, '')}.${format.extension}`;
    return { blob, filename };
  } catch (error) {
    if (timedOut) throw new Error('Conversion timed out. Please try a smaller document.');
    if (error instanceof Error && error.name === 'AbortError') throw error;
    if (error instanceof TypeError) throw new Error('The conversion service could not be reached. Please try again later.');
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', cancel);
  }
}
