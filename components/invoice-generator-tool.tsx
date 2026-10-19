'use client';

import { useState } from 'react';
import { invoiceTotals, type InvoiceLine } from '@/lib/utility-operations';
import { createInvoicePdf, type InvoiceDraft } from '@/lib/invoice-pdf';
import { downloadBlob } from '@/lib/download';
import { runToolOperation } from '@/lib/tool-operation';
import { useUtilityTask, UtilityTaskFeedback } from './utility-task';

export function InvoiceGeneratorTool() {
  const [kind, setKind] = useState('invoice'); const [number, setNumber] = useState('INV-001'); const [date, setDate] = useState('');
  const [from, setFrom] = useState(''); const [to, setTo] = useState(''); const [notes, setNotes] = useState('');
  const [currency, setCurrency] = useState('INR'); const [discount, setDiscount] = useState('0'); const [tax, setTax] = useState('0');
  const [lines, setLines] = useState<InvoiceLine[]>([{ description: '', quantity: '1', price: '0' }]);
  const [exportError, setExportError] = useState(''); const [exporting, setExporting] = useState(false);
  const task = useUtilityTask<{ draft: InvoiceDraft; totals: ReturnType<typeof invoiceTotals> }>('invoice-generator');
  const reset = () => { task.reset(); setExportError(''); };
  const update = (setter: (value: string) => void, value: string) => { reset(); setter(value); };
  const updateLine = (index: number, key: keyof InvoiceLine, value: string) => { reset(); setLines(lines.map((line, current) => current === index ? { ...line, [key]: value } : line)); };
  const preview = () => task.run(() => {
    if (!from.trim() || !to.trim() || !number.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Enter a reference, date, sender, and customer before previewing.');
    const draft = { kind, number, date, from, to, notes, currency, lines: lines.map(line => ({ ...line })), discount, tax };
    return { draft, totals: invoiceTotals(lines, discount, tax) };
  });
  const exportPdf = async () => {
    if (!task.result || exporting) return;
    setExporting(true); setExportError('');
    try { const blob = await runToolOperation('invoice-generator', () => createInvoicePdf(task.result!.draft)); downloadBlob(blob, `${task.result.draft.kind}.pdf`); }
    catch (error) { setExportError(error instanceof Error ? error.message : 'PDF export failed.'); }
    finally { setExporting(false); }
  };
  const result = task.result;
  const money = (amount: number) => `${result?.draft.currency ?? currency} ${(amount / 100).toFixed(2)}`;
  const print = () => {
    document.body.classList.add('printing-invoice');
    window.addEventListener('afterprint', () => document.body.classList.remove('printing-invoice'), { once: true });
    window.print();
  };
  return <div className="utility-workspace">
    <div className="utility-three-fields"><div><label className="utility-label" htmlFor="invoice-kind">Document type</label><select id="invoice-kind" value={kind} onChange={event => update(setKind, event.target.value)}><option value="invoice">Invoice</option><option value="quotation">Quotation</option></select></div><div><label className="utility-label" htmlFor="invoice-number">Reference number</label><input id="invoice-number" maxLength={60} value={number} onChange={event => update(setNumber, event.target.value)} /></div><div><label className="utility-label" htmlFor="invoice-date">Issue date</label><input id="invoice-date" type="date" value={date} onChange={event => update(setDate, event.target.value)} /></div></div>
    <div className="utility-two-fields"><div><label className="utility-label" htmlFor="invoice-from">Your business and address</label><textarea id="invoice-from" rows={4} maxLength={1000} value={from} onChange={event => update(setFrom, event.target.value)} /></div><div><label className="utility-label" htmlFor="invoice-to">Customer and address</label><textarea id="invoice-to" rows={4} maxLength={1000} value={to} onChange={event => update(setTo, event.target.value)} /></div></div>
    <fieldset className="invoice-items"><legend>Line items</legend>{lines.map((line, index) => <div key={index} className="invoice-item"><div><label className="utility-label" htmlFor={`item-${index}`}>Item {index + 1}</label><input id={`item-${index}`} maxLength={250} value={line.description} onChange={event => updateLine(index, 'description', event.target.value)} /></div><div><label className="utility-label" htmlFor={`quantity-${index}`}>Quantity {index + 1}</label><input id={`quantity-${index}`} type="number" min="0.01" max="10000" step="0.01" value={line.quantity} onChange={event => updateLine(index, 'quantity', event.target.value)} /></div><div><label className="utility-label" htmlFor={`price-${index}`}>Unit price {index + 1}</label><input id={`price-${index}`} type="number" min="0" max="1000000" step="0.01" value={line.price} onChange={event => updateLine(index, 'price', event.target.value)} /></div><button className="utility-secondary" type="button" aria-label={`Remove item ${index + 1}`} disabled={lines.length === 1} onClick={() => { reset(); setLines(lines.filter((_, current) => current !== index)); }}>Remove</button></div>)}<button className="utility-secondary mt-4" type="button" disabled={lines.length >= 30} onClick={() => { reset(); setLines([...lines, { description: '', quantity: '1', price: '0' }]); }}>Add item</button></fieldset>
    <div className="utility-three-fields"><div><label className="utility-label" htmlFor="invoice-currency">Currency</label><select id="invoice-currency" value={currency} onChange={event => update(setCurrency, event.target.value)}>{['INR', 'USD', 'EUR', 'GBP'].map(code => <option key={code}>{code}</option>)}</select></div><div><label className="utility-label" htmlFor="invoice-discount">Discount (%)</label><input id="invoice-discount" type="number" min="0" max="100" step="0.01" value={discount} onChange={event => update(setDiscount, event.target.value)} /></div><div><label className="utility-label" htmlFor="invoice-tax">Tax after discount (%)</label><input id="invoice-tax" type="number" min="0" max="100" step="0.01" value={tax} onChange={event => update(setTax, event.target.value)} /></div></div>
    <label className="utility-label" htmlFor="invoice-notes">Notes and identifiers (optional)</label><textarea id="invoice-notes" rows={3} maxLength={2000} value={notes} onChange={event => update(setNotes, event.target.value)} />
    <button className="button-primary mt-6" type="button" onClick={preview}>Preview document</button><UtilityTaskFeedback task={task} />
    {result && <><section className="invoice-preview" aria-label="Document preview"><header><h2>{result.draft.kind === 'quotation' ? 'Quotation' : 'Invoice'}</h2><p>{result.draft.number} / {result.draft.date}</p></header><div className="utility-two-fields"><div><h3>From</h3><p>{result.draft.from}</p></div><div><h3>To</h3><p>{result.draft.to}</p></div></div><div className="invoice-table-wrap"><table><thead><tr><th>Item</th><th>Quantity</th><th>Unit price</th><th>Amount</th></tr></thead><tbody>{result.draft.lines.map((line, index) => <tr key={index}><td>{line.description}</td><td>{line.quantity}</td><td>{money(Math.round(Number(line.price) * 100))}</td><td>{money(result.totals.amounts[index])}</td></tr>)}</tbody></table></div><dl className="invoice-totals"><div><dt>Subtotal</dt><dd>{money(result.totals.subtotal)}</dd></div><div><dt>Discount</dt><dd>-{money(result.totals.discount)}</dd></div><div><dt>Tax</dt><dd>{money(result.totals.tax)}</dd></div><div><dt>Total</dt><dd>{money(result.totals.total)}</dd></div></dl>{result.draft.notes && <p>{result.draft.notes}</p>}</section><div className="utility-actions"><button className="utility-secondary" type="button" disabled={exporting} onClick={exportPdf}>{exporting ? 'Exporting PDF...' : 'Download PDF'}</button><button className="utility-secondary" type="button" onClick={print}>Print / save PDF</button></div>{exportError && <p role="alert" className="utility-error">{exportError}</p>}</>}
    <p className="utility-note">Nothing is saved or uploaded. Tax is entered by you and rounded after discount; this is not an accounting, GST registration, e-invoicing, or payment service. Check applicable requirements before issuing. Download PDF uses a limited built-in font; Print / save PDF uses your browser fonts for other languages.</p>
  </div>;
}
