const serviceBase = (process.env.NEXT_PUBLIC_TOOL_API_URL ?? 'https://tools.dhebe.com/api/tools').replace(/\/$/, '');

export const serverToolIds = new Set([
  'word-to-pdf', 'powerpoint-to-pdf', 'excel-to-pdf', 'html-to-pdf',
  'pdf-to-word', 'pdf-to-powerpoint', 'pdf-to-excel', 'pdf-to-pdfa', 'protect',
  'repair',
]);

export async function convertOnServer(tool: string, file: File, password = '', signal?: AbortSignal) {
  const form = new FormData();
  form.append('file', file);
  if (password) form.append('password', password);
  let response: Response;
  try {
    response = await fetch(`${serviceBase}/jobs/${encodeURIComponent(tool)}`, { method: 'POST', body: form, signal });
    if (response.status === 202) {
      const { job } = await response.json();
      if (typeof job !== 'string' || !/^[A-Za-z0-9_-]+$/.test(job)) throw new Error('Invalid conversion job.');
      const deadline = Date.now() + 300_000;
      do {
        if (Date.now() > deadline) throw new Error('Conversion timed out. Please try a smaller document.');
        await new Promise<void>((resolve, reject) => {
          const abort = () => { clearTimeout(timer); reject(new DOMException('Cancelled', 'AbortError')); };
          const timer = window.setTimeout(() => { signal?.removeEventListener('abort', abort); resolve(); }, 1000);
          if (signal?.aborted) abort();
          else signal?.addEventListener('abort', abort, { once: true });
        });
        response = await fetch(`${serviceBase}/jobs/${job}`, { signal, cache: 'no-store' });
      } while (response.status === 202);
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw error;
    throw new Error('The conversion service could not be reached. Please try again later.');
  }
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(typeof body?.detail === 'string' ? body.detail : 'The conversion service is unavailable. Please try again later.');
  }
  const blob = await response.blob();
  if (!blob.size || blob.type.includes('text/html')) throw new Error('The conversion service returned an invalid file.');
  const disposition = response.headers.get('content-disposition') ?? '';
  const filename = disposition.match(/filename="([^"]+)"/)?.[1] ?? `converted-${file.name}`;
  return { blob, filename };
}
