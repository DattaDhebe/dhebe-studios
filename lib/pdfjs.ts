export async function getPdfJs() {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = `/pdfjs/${pdfjs.version}/pdf.worker.min.js`;
  return pdfjs;
}

export async function loadPdf(data: ArrayBuffer | Uint8Array) {
  const pdfjs = await getPdfJs();
  const base = `/pdfjs/${pdfjs.version}/`;
  return pdfjs.getDocument({
    data,
    cMapUrl: `${base}cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `${base}standard_fonts/`,
    wasmUrl: `${base}wasm/`,
  });
}
