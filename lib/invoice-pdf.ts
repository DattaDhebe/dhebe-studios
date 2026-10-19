import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { invoiceTotals, type InvoiceLine } from './utility-operations';

export interface InvoiceDraft {
  kind: string; number: string; date: string; from: string; to: string; notes: string;
  currency: string; lines: InvoiceLine[]; discount: string; tax: string;
}
export async function createInvoicePdf(draft: InvoiceDraft) {
  const totals = invoiceTotals(draft.lines, draft.discount, draft.tax);
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page = pdf.addPage([595.28, 841.89]); let y = 790;
  const money = (cents: number) => `${draft.currency} ${(cents / 100).toFixed(2)}`;
  const write = (text: string, heading = false) => {
    for (const paragraph of text.replace(/\r/g, '').split('\n')) {
      const rows: string[] = []; let line = '';
      for (const character of paragraph) {
        if (font.widthOfTextAtSize(line + character, heading ? 13 : 11) > 490 && line) { rows.push(line); line = ''; }
        line += character;
      }
      rows.push(line);
      for (const row of rows) {
        if (y < 60) { page = pdf.addPage([595.28, 841.89]); y = 790; }
        page.drawText(row, { x: 50, y, font: heading ? bold : font, size: heading ? 13 : 11, color: rgb(0.12, 0.16, 0.13) }); y -= 18;
      }
    }
    y -= 8;
  };
  try {
    write(draft.kind === 'quotation' ? 'QUOTATION' : 'INVOICE', true);
    write(`Reference: ${draft.number}\nDate: ${draft.date}\nCurrency: ${draft.currency}`);
    write('From', true); write(draft.from); write('To', true); write(draft.to);
    write('Items', true);
    draft.lines.forEach((line, index) => write(`${index + 1}. ${line.description}\n${line.quantity} x ${money(Math.round(Number(line.price) * 100))} = ${money(totals.amounts[index])}`));
    write(`Subtotal: ${money(totals.subtotal)}\nDiscount (${draft.discount}%): -${money(totals.discount)}\nTax (${draft.tax}%): ${money(totals.tax)}`);
    write(`TOTAL: ${money(totals.total)}`, true);
    if (draft.notes.trim()) { write('Notes', true); write(draft.notes); }
    write('Prepared with DHEBE Studios. Review all details and applicable requirements before issuing.');
    for (const [index, current] of pdf.getPages().entries()) current.drawText(`${index + 1} / ${pdf.getPageCount()}`, { x: 50, y: 30, font, size: 9 });
    return new Blob([new Uint8Array(await pdf.save())], { type: 'application/pdf' });
  } catch (error) {
    if (error instanceof Error && /encode|WinAnsi/.test(error.message)) throw new Error('The downloadable PDF font cannot represent a character in this draft. Use Print / save PDF for all languages, or use Latin-script text. Your draft is unchanged.');
    throw error;
  }
}
