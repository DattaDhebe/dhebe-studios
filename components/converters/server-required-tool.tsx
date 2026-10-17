'use client';

export function ServerRequiredTool() {
  return <div role="status" className="theme-card-soft space-y-3 rounded-2xl border p-6">
    <p className="font-semibold theme-title">Conversion service required</p>
    <p className="text-sm theme-muted">This conversion requires a document processing service. It will become available when the service is connected.</p>
  </div>;
}
