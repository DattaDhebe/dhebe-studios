'use client';

import Link from 'next/link';

interface SupportClientProps {
  structuredData: any;
}

export function SupportClient({ structuredData }: SupportClientProps) {
  return (
    <>
      <script
        id="support-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_32%),linear-gradient(180deg,_#fffaf5_0%,_#fff7ed_38%,_#fffdf8_100%)] px-4 py-6 text-[var(--app-text)] transition-colors duration-200 xl:px-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="rounded-[2rem] border p-6 backdrop-blur theme-panel sm:p-8">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-800 dark:text-cyan-400">Support</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight theme-title">
                Help and usage guidance for all DHEBE tools
              </h1>
            </div>
            <p className="mt-4 max-w-4xl text-sm leading-7 theme-muted sm:text-base">
              This support page covers the Base64 Converter, PDF Studio, Calculator Studio, and the Email Template Editor. Use it to understand what each tool is for, how to choose the right workflow, and how privacy-first browser processing works across the platform.
            </p>

            <div className="mt-6 rounded-[1.5rem] border p-5 theme-card-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] theme-muted-2">Contact</p>
              <p className="mt-2 text-lg font-semibold theme-title">Support email</p>
              <a
                href="mailto:support@dhebe.com"
                className="mt-2 inline-flex text-base font-medium text-cyan-800 transition hover:text-cyan-950 dark:text-cyan-400 dark:hover:text-cyan-300"
              >
                support@dhebe.com
              </a>
              <p className="mt-2 text-sm leading-6 theme-muted">
                Use this address for tool help, feature requests, and deployment or compatibility questions.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/base64-converter/"
                className="theme-card inline-flex items-center rounded-2xl border px-4 py-3 text-sm font-semibold text-[var(--app-title)] transition hover:scale-[1.01]"
                prefetch={false}
              >
                Open Base64 Converter
              </Link>
              <Link
                href="/pdf-studio/"
                className="theme-card inline-flex items-center rounded-2xl border px-4 py-3 text-sm font-semibold text-[var(--app-title)] transition hover:scale-[1.01]"
                prefetch={false}
              >
                Open PDF Studio
              </Link>
              <Link
                href="/email-template-editor/"
                className="theme-card inline-flex items-center rounded-2xl border px-4 py-3 text-sm font-semibold text-[var(--app-title)] transition hover:scale-[1.01]"
                prefetch={false}
              >
                Open Email Template Editor
              </Link>
            </div>
          </section>

          <section className="rounded-[2rem] border p-6 theme-privacy sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] theme-privacy-muted">
              Privacy First
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight theme-privacy-title">
              Local tools keep files on your device. Server conversions delete temporary files after processing.
            </h2>
            <p className="mt-4 max-w-4xl text-sm leading-7 theme-privacy-text sm:text-base">
              DHEBE tools are designed for browser-based processing. For most workflows, data is handled locally on your device without server-side file retention.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border p-5 theme-privacy-inner">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] theme-privacy-muted">
                  Processing
                </p>
                <p className="mt-2 text-lg font-semibold theme-privacy-title">Client-side by design</p>
                <p className="mt-2 text-sm leading-6 theme-privacy-text">
                  Base64, PDF, and preview-heavy workflows run in browser memory for speed and privacy.
                </p>
              </div>
              <div className="rounded-[1.5rem] border p-5 theme-privacy-inner">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] theme-privacy-muted">
                  Storage
                </p>
                <p className="mt-2 text-lg font-semibold theme-privacy-title">No upload retention</p>
                <p className="mt-2 text-sm leading-6 theme-privacy-text">
                  Files are not stored as part of standard conversion and editing flows.
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[2rem] border p-6 backdrop-blur theme-panel sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight theme-title">Base64 Converter</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 theme-muted sm:text-base">
                <li>Use for encoding files/text into Base64 for APIs, email payloads, and data URLs.</li>
                <li>Use decoders when you need to recover original files from Base64 strings.</li>
                <li>Best for quick transforms between text-safe and binary formats.</li>
              </ul>
            </div>

            <div className="rounded-[2rem] border p-6 backdrop-blur theme-panel sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight theme-title">PDF Studio</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 theme-muted sm:text-base">
                <li>Use compressor, merger, splitter, rotate, and page tools for document workflows.</li>
                <li>Use edit/sign/annotate utilities to modify documents before download.</li>
                <li>Use OCR and conversion tools when you need searchable or portable output.</li>
              </ul>
            </div>

            <div className="rounded-[2rem] border p-6 backdrop-blur theme-panel sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight theme-title">Email Template Editor</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 theme-muted sm:text-base">
                <li>Use it to design responsive HTML email templates for campaigns, newsletters, and onboarding.</li>
                <li>Helpful when preparing reusable drag-and-drop sections for launches and marketing updates.</li>
                <li>Best paired with Base64 tools when embedding small assets or sharing HTML-ready output.</li>
              </ul>
            </div>
          </section>

          <section className="rounded-[2rem] border p-6 backdrop-blur theme-panel sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight theme-title">Common support notes</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.5rem] border p-5 theme-card-soft">
                <p className="text-sm font-semibold text-cyan-800 dark:text-cyan-400">Preview limitations</p>
                <p className="mt-2 text-sm leading-6 theme-muted">
                  If preview fails for a format/browser combination, download and open in a dedicated app.
                </p>
              </div>
              <div className="rounded-[1.5rem] border p-5 theme-card-soft">
                <p className="text-sm font-semibold text-cyan-800 dark:text-cyan-400">Large files</p>
                <p className="mt-2 text-sm leading-6 theme-muted">
                  Very large PDFs and media may need more memory; close other tabs for better performance.
                </p>
              </div>
              <div className="rounded-[1.5rem] border p-5 theme-card-soft">
                <p className="text-sm font-semibold text-cyan-800 dark:text-cyan-400">Direct tool pages</p>
                <p className="mt-2 text-sm leading-6 theme-muted">
                  Use dedicated tool routes for focused workflows and easier sharing/bookmarking.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
