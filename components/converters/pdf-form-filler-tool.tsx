'use client';

import { useRef, useState } from 'react';
import { PDFDocument, PDFTextField, PDFCheckBox, PDFRadioGroup, PDFDropdown, PDFOptionList } from 'pdf-lib';
import { PdfDropZone } from '@/components/converters/pdf-drop-zone';

interface FormFieldModel {
  name: string;
  type: string;
}

export function PdfFormFillerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string>('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [fields, setFields] = useState<FormFieldModel[]>([]);
  const [filling, setFilling] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      setFormError('Please select a valid PDF file.');
      return;
    }

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const form = pdfDoc.getForm();
      const detectedFields = form.getFields().map((field) => ({
        name: field.getName(),
        type: field instanceof PDFTextField ? 'TextField' : field instanceof PDFCheckBox ? 'CheckBox' : field instanceof PDFRadioGroup ? 'RadioGroup' : field instanceof PDFDropdown ? 'Dropdown' : field instanceof PDFOptionList ? 'OptionList' : 'ReadOnly',
      }));

      setFile(selectedFile);
      setFields(detectedFields);
      setFormData({});
      setFormError('');
    } catch {
      setFormError('Failed to read PDF form fields.');
    }
  };

  const handleFormFieldChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleFillForm = async () => {
    if (!file) {
      setFormError('Please select a PDF file.');
      return;
    }

    if (fields.length === 0) {
      setFormError('No editable form fields were detected in this PDF.');
      return;
    }

    setFilling(true);
    setFormError('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const form = pdfDoc.getForm();

      for (const field of form.getFields()) {
        const name = field.getName();
        const value = formData[name];
        if (value === undefined) continue;

        if (field instanceof PDFTextField) {
          form.getTextField(name).setText(value);
        } else if (field instanceof PDFCheckBox) {
          const normalized = value.toLowerCase();
          if (['true', 'yes', '1', 'checked'].includes(normalized)) {
            form.getCheckBox(name).check();
          } else {
            form.getCheckBox(name).uncheck();
          }
        } else if (field instanceof PDFRadioGroup) {
          form.getRadioGroup(name).select(value);
        } else if (field instanceof PDFDropdown) {
          form.getDropdown(name).select(value);
        } else if (field instanceof PDFOptionList) {
          form.getOptionList(name).select(value);
        }
      }

      const filledPdf = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(filledPdf)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `filled-${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Form filling failed.');
    } finally {
      setFilling(false);
    }
  };

  return (
    <div className="space-y-6">
      <PdfDropZone
        inputRef={fileInputRef}
        onSelect={(selected) => selected instanceof File && handleFileSelect(selected)}
        title="Drop your PDF form here"
      />

      {file && (
        <div className="theme-card rounded-2xl border p-6 space-y-4">
          <div>
            <p className="text-sm font-semibold theme-title">Selected File</p>
            <p className="mt-2 text-base theme-muted">{file.name}</p>
            <p className="mt-1 text-sm theme-muted">Detected fields: {fields.length}</p>
          </div>

          {fields.length > 0 ? (
            <div className="border-t pt-4 space-y-3">
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] theme-muted-2">
                    {field.name} ({field.type.replace('PDF', '')})
                  </label>
                  <input
                    type="text"
                    value={formData[field.name] || ''}
                    onChange={(e) => handleFormFieldChange(field.name, e.target.value)}
                    placeholder={`Enter value for ${field.name}`}
                    className="theme-card w-full rounded-lg border px-4 py-2 theme-title focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm text-amber-900">
                No AcroForm fields were detected in this PDF. Upload an interactive form PDF to auto-fill fields.
              </p>
            </div>
          )}

          <div className="flex gap-3 border-t pt-4">
            <button
              onClick={handleFillForm}
              disabled={filling || fields.length === 0}
              className="flex-1 rounded-lg bg-teal-600 px-4 py-3 font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
            >
              {filling ? 'Filling Form...' : 'Fill and Download PDF'}
            </button>
            <button
              onClick={() => {
                setFile(null);
                setFormData({});
                setFields([]);
              }}
              className="theme-card rounded-lg px-4 py-3 font-semibold theme-title transition hover:brightness-95"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {formError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-900">{formError}</p>
        </div>
      )}
    </div>
  );
}
