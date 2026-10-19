export async function convertHeic(file: File, format: 'image/jpeg' | 'image/png', signal: AbortSignal) {
  signal.throwIfAborted();
  const metadata = new Uint8Array(await file.slice(0, 2_000_000).arrayBuffer());
  const view = new DataView(metadata.buffer);
  for (let offset = 4; offset + 16 <= metadata.length; offset++) {
    if (metadata[offset] === 105 && metadata[offset + 1] === 115 && metadata[offset + 2] === 112 && metadata[offset + 3] === 101 && view.getUint32(offset - 4) === 20 && view.getUint32(offset + 8) * view.getUint32(offset + 12) > 40_000_000) throw new Error('This image exceeds 40 megapixels.');
  }
  signal.throwIfAborted();
  return new Promise<{ blob: Blob; width: number; height: number }>((resolve, reject) => {
    const worker = new Worker('/heic-converter.worker.js', { type: 'module' });
    const cleanup = () => { worker.terminate(); clearTimeout(timer); signal.removeEventListener('abort', abort); };
    const abort = () => { cleanup(); reject(new DOMException('Conversion cancelled.', 'AbortError')); };
    const timer = setTimeout(() => { cleanup(); reject(new Error('HEIC conversion timed out. Try a smaller photo.')); }, 90_000);
    signal.addEventListener('abort', abort, { once: true });
    worker.onerror = () => { cleanup(); reject(new Error('The decoder could not start. Try a current browser with WebAssembly support.')); };
    worker.onmessage = event => {
      cleanup();
      const result = event.data;
      if (result.error || !(result.blob instanceof Blob) || result.blob.type !== format || !Number.isInteger(result.width) || !Number.isInteger(result.height)) reject(new Error(result.error || 'The decoder returned an invalid image.'));
      else resolve({ blob: result.blob, width: result.width, height: result.height });
    };
    worker.postMessage({ file, format });
  });
}
