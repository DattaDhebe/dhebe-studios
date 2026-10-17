'use client';

import { useRef, useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { PdfDropZone } from '@/components/converters/pdf-drop-zone';
import { ServerRequiredTool } from './server-required-tool';

type PdfBuilderMode =
  | 'scan-to-pdf'
  | 'convert-to-pdf'
  | 'word-to-pdf'
  | 'powerpoint-to-pdf'
  | 'excel-to-pdf'
  | 'html-to-pdf';

type ConvertSource = 'images' | 'text' | 'html';

interface PdfBuilderToolProps {
  mode: PdfBuilderMode;
}

const LETTER_PAGE: [number, number] = [612, 792];
const SLIDE_PAGE: [number, number] = [960, 540];

function downloadBytes(bytes: Uint8Array, filename: string, type: string) {
  const blob = new Blob([Uint8Array.from(bytes).buffer], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function getBaseName(name: string) {
  return name.replace(/\.[^.]+$/, '') || 'document';
}

function wrapText(text: string, maxWidth: number, widthFor: (input: string) => number) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return [''];
  }

  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (widthFor(nextLine) <= maxWidth) {
      currentLine = nextLine;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
      currentLine = word;
      continue;
    }

    let chunk = '';
    for (const char of word) {
      const nextChunk = `${chunk}${char}`;
      if (widthFor(nextChunk) > maxWidth && chunk) {
        lines.push(chunk);
        chunk = char;
      } else {
        chunk = nextChunk;
      }
    }
    currentLine = chunk;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

async function buildImagePdf(files: File[]) {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const lowerName = file.name.toLowerCase();
    const isPng = file.type === 'image/png' || lowerName.endsWith('.png');
    const image = isPng ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);
    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  return new Uint8Array(await pdfDoc.save());
}

async function buildTextPdf(title: string, rawText: string) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const margin = 48;
  const lineHeight = 18;
  const bodySize = 12;
  const maxWidth = LETTER_PAGE[0] - margin * 2;

  const paragraphs = rawText
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  let page = pdfDoc.addPage(LETTER_PAGE);
  let y = LETTER_PAGE[1] - margin;

  page.drawText(title, {
    x: margin,
    y,
    size: 20,
    font: boldFont,
    color: rgb(0.08, 0.12, 0.2),
  });
  y -= 34;

  if (paragraphs.length === 0) {
    paragraphs.push('No content provided.');
  }

  for (const paragraph of paragraphs) {
    const lines = wrapText(paragraph, maxWidth, (input) => font.widthOfTextAtSize(input, bodySize));
    for (const line of lines) {
      if (y < margin) {
        page = pdfDoc.addPage(LETTER_PAGE);
        y = LETTER_PAGE[1] - margin;
      }
      page.drawText(line, {
        x: margin,
        y,
        size: bodySize,
        font,
        color: rgb(0.15, 0.17, 0.22),
      });
      y -= lineHeight;
    }
    y -= 8;
  }

  return new Uint8Array(await pdfDoc.save());
}

async function buildSlidesPdf(slidesInput: string) {
  const pdfDoc = await PDFDocument.create();
  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const bodyFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const slides = slidesInput
    .split(/\n\s*---+\s*\n/g)
    .map((block) => block.trim())
    .filter(Boolean);

  const usableSlides = slides.length > 0 ? slides : ['Untitled Slide\nAdd your talking points here.'];

  for (const slide of usableSlides) {
    const page = pdfDoc.addPage(SLIDE_PAGE);
    const [title = 'Untitled Slide', ...bodyLines] = slide
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    page.drawRectangle({
      x: 0,
      y: SLIDE_PAGE[1] - 96,
      width: SLIDE_PAGE[0],
      height: 96,
      color: rgb(0.09, 0.35, 0.74),
    });

    page.drawText(title, {
      x: 48,
      y: SLIDE_PAGE[1] - 58,
      size: 28,
      font: titleFont,
      color: rgb(1, 1, 1),
    });

    let y = SLIDE_PAGE[1] - 146;
    const maxWidth = SLIDE_PAGE[0] - 120;
    const lines = bodyLines.length > 0 ? bodyLines : ['Add bullet points for this slide.'];

    for (const item of lines) {
      const wrapped = wrapText(item.replace(/^[*-]\s*/, ''), maxWidth, (input) =>
        bodyFont.widthOfTextAtSize(input, 18),
      );
      for (const line of wrapped) {
        page.drawText(`• ${line}`, {
          x: 60,
          y,
          size: 18,
          font: bodyFont,
          color: rgb(0.14, 0.16, 0.2),
        });
        y -= 28;
      }
      y -= 8;
    }
  }

  return new Uint8Array(await pdfDoc.save());
}

function parseTable(input: string) {
  return input
    .split('\n')
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => row.split(/\t|,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map((cell) => cell.replace(/^"|"$/g, '').trim()));
}

async function buildTablePdf(rawTable: string) {
  const rows = parseTable(rawTable);
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const margin = 36;
  const rowHeight = 24;
  const width = LETTER_PAGE[0] - margin * 2;
  const maxColumns = Math.max(...rows.map((row) => row.length), 1);
  const columnWidth = width / maxColumns;
  const safeRows = rows.length > 0 ? rows : [['Column 1', 'Column 2'], ['Value A', 'Value B']];

  let page = pdfDoc.addPage(LETTER_PAGE);
  let y = LETTER_PAGE[1] - margin;

  page.drawText('Table to PDF', {
    x: margin,
    y,
    size: 18,
    font: boldFont,
    color: rgb(0.09, 0.12, 0.22),
  });
  y -= 34;

  for (const [rowIndex, row] of safeRows.entries()) {
    if (y < margin + rowHeight) {
      page = pdfDoc.addPage(LETTER_PAGE);
      y = LETTER_PAGE[1] - margin;
    }

    row.forEach((cell, cellIndex) => {
      const x = margin + cellIndex * columnWidth;
      page.drawRectangle({
        x,
        y: y - rowHeight + 4,
        width: columnWidth,
        height: rowHeight,
        borderWidth: 1,
        borderColor: rgb(0.8, 0.84, 0.9),
        color: rowIndex === 0 ? rgb(0.91, 0.95, 1) : rgb(1, 1, 1),
      });

      const lines = wrapText(cell || ' ', columnWidth - 10, (input) =>
        (rowIndex === 0 ? boldFont : font).widthOfTextAtSize(input, 10),
      );

      page.drawText(lines[0] ?? '', {
        x: x + 5,
        y: y - 12,
        size: 10,
        font: rowIndex === 0 ? boldFont : font,
        color: rgb(0.16, 0.18, 0.22),
      });
    });

    y -= rowHeight;
  }

  return new Uint8Array(await pdfDoc.save());
}

function extractTextFromHtml(rawHtml: string) {
  const parser = new DOMParser();
  const documentNode = parser.parseFromString(rawHtml, 'text/html');
  const blocks = Array.from(documentNode.body.querySelectorAll('h1, h2, h3, p, li, td, th'))
    .map((node) => node.textContent?.trim() ?? '')
    .filter(Boolean);

  if (blocks.length > 0) {
    return blocks.join('\n\n');
  }

  return documentNode.body.textContent?.replace(/\s+/g, ' ').trim() ?? '';
}

function getModeCopy(mode: PdfBuilderMode) {
  switch (mode) {
    case 'scan-to-pdf':
      return {
        title: 'Drop scanned images here',
        helper: 'or click to browse (JPG or PNG files)',
        button: 'Build Scan PDF',
      };
    case 'convert-to-pdf':
      return {
        title: 'Convert content into a PDF',
        helper: 'Choose images, text, or HTML below',
        button: 'Convert to PDF',
      };
    case 'word-to-pdf':
      return {
        title: 'Paste document text',
        helper: 'Bring in text from a Word-style document',
        button: 'Create PDF',
      };
    case 'powerpoint-to-pdf':
      return {
        title: 'Paste your slide outline',
        helper: 'Separate slides with --- on its own line',
        button: 'Create Slide PDF',
      };
    case 'excel-to-pdf':
      return {
        title: 'Paste CSV or tab-separated data',
        helper: 'Header row first works best',
        button: 'Create Table PDF',
      };
    case 'html-to-pdf':
      return {
        title: 'Paste HTML content',
        helper: 'Text and heading content will be laid out into a PDF',
        button: 'Create HTML PDF',
      };
  }
}

export function PdfBuilderTool({ mode }: PdfBuilderToolProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [sourceType, setSourceType] = useState<ConvertSource>('images');
  const [content, setContent] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const copy = getModeCopy(mode);
  const isImageMode = mode === 'scan-to-pdf' || (mode === 'convert-to-pdf' && sourceType === 'images');
  const isTextMode =
    mode === 'word-to-pdf' ||
    mode === 'powerpoint-to-pdf' ||
    mode === 'excel-to-pdf' ||
    mode === 'html-to-pdf' ||
    (mode === 'convert-to-pdf' && sourceType !== 'images');

  const handleFileSelect = (selected: FileList | File | null) => {
    const list = selected instanceof FileList ? Array.from(selected) : selected ? [selected] : [];
    const valid = list.filter((file) => {
      const lowerName = file.name.toLowerCase();
      return (
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        lowerName.endsWith('.jpg') ||
        lowerName.endsWith('.jpeg') ||
        lowerName.endsWith('.png')
      );
    });

    if (valid.length === 0) {
      setError('Please upload JPG or PNG images.');
      return;
    }

    setFiles(valid);
    setError('');
  };

  const handleBuild = async () => {
    setProcessing(true);
    setError('');

    try {
      let bytes: Uint8Array;
      let filename = 'converted.pdf';

      if (isImageMode) {
        if (files.length === 0) {
          throw new Error('Please choose at least one image file.');
        }

        bytes = await buildImagePdf(files);
        filename =
          mode === 'scan-to-pdf'
            ? `scan-${getBaseName(files[0].name)}.pdf`
            : `converted-${getBaseName(files[0].name)}.pdf`;
      } else {
        if (!content.trim()) {
          throw new Error('Please add some content first.');
        }

        if (mode === 'powerpoint-to-pdf') {
          bytes = await buildSlidesPdf(content);
          filename = 'slides.pdf';
        } else if (mode === 'excel-to-pdf') {
          bytes = await buildTablePdf(content);
          filename = 'table.pdf';
        } else {
          const text =
            mode === 'html-to-pdf' || (mode === 'convert-to-pdf' && sourceType === 'html')
              ? extractTextFromHtml(content)
              : content;
          bytes = await buildTextPdf('PDF Studio Export', text);
          filename = 'document.pdf';
        }
      }

      downloadBytes(bytes, filename, 'application/pdf');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create PDF.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {['word-to-pdf', 'powerpoint-to-pdf', 'excel-to-pdf', 'html-to-pdf'].includes(mode) ? <ServerRequiredTool /> : <>
      {mode === 'convert-to-pdf' && (
        <div className="theme-card rounded-2xl border p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] theme-muted-2">
            Source Type
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(['images', 'text', 'html'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSourceType(option)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  sourceType === option
                    ? 'bg-slate-950 text-white'
                    : 'theme-card border theme-title hover:brightness-95'
                }`}
              >
                {option === 'images' ? 'Images' : option === 'text' ? 'Text' : 'HTML'}
              </button>
            ))}
          </div>
        </div>
      )}

      {isImageMode && (
        <PdfDropZone
          inputRef={fileInputRef}
          onSelect={handleFileSelect}
          multiple
          accept="image/jpeg,image/png,.jpg,.jpeg,.png"
          title={copy.title}
          helperText={copy.helper}
        />
      )}

      {isTextMode && (
        <div className="theme-card rounded-2xl border p-6 space-y-4">
          <div>
            <p className="text-sm font-semibold theme-title">{copy.title}</p>
            <p className="mt-1 text-sm theme-muted">{copy.helper}</p>
          </div>

          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={mode === 'powerpoint-to-pdf' ? 12 : 14}
            className="theme-card min-h-[260px] w-full rounded-2xl border px-4 py-3 theme-title focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder={
              mode === 'powerpoint-to-pdf'
                ? 'Quarterly Review\nRevenue is up 18%\nPipeline grew across enterprise accounts\n---\nNext Steps\nLaunch expansion plan\nPrepare Q4 hiring plan'
                : mode === 'excel-to-pdf'
                  ? 'Name\tQ1\tQ2\nNorth\t120\t150\nSouth\t98\t110'
                  : mode === 'html-to-pdf'
                    ? '<h1>Proposal</h1><p>This is your HTML content.</p>'
                    : 'Paste your content here...'
            }
          />
        </div>
      )}

      {((isImageMode && files.length > 0) || isTextMode) && (
        <div className="theme-card rounded-2xl border p-6 space-y-4">
          {isImageMode && (
            <p className="text-sm theme-muted">
              {files.length} image file{files.length === 1 ? '' : 's'} selected
            </p>
          )}

          <button
            onClick={handleBuild}
            disabled={processing}
            className="w-full rounded-lg bg-cyan-600 px-4 py-3 font-semibold text-white hover:bg-cyan-700 disabled:opacity-50"
          >
            {processing ? 'Preparing PDF...' : copy.button}
          </button>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-900">{error}</p>
        </div>
      )}
      </>}
    </div>
  );
}
