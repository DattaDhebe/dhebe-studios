'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import { downloadBlob } from '@/lib/download';
import { SITE_URL } from '@/lib/site';

type Align = 'left' | 'center';
type BlockType = 'hero' | 'text' | 'image' | 'cta' | 'divider' | 'footer';
type SidebarView = 'templates' | 'blocks' | 'brand' | 'campaign';
type WorkspaceView = 'compose' | 'preview' | 'html';
type PreviewDevice = 'desktop' | 'mobile';

interface ThemeSettings {
  campaignName: string;
  brandName: string;
  senderName: string;
  audienceLabel: string;
  objective: string;
  subjectLine: string;
  preheader: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  titleColor: string;
  bodyColor: string;
}

interface EmailBlock {
  id: string;
  type: BlockType;
  eyebrow: string;
  title: string;
  body: string;
  buttonLabel: string;
  buttonUrl: string;
  imageUrl: string;
  altText: string;
  secondaryText: string;
  align: Align;
  tone: string;
}

interface PresetDefinition {
  id: string;
  title: string;
  description: string;
  category: string;
  theme: ThemeSettings;
  blocks: Omit<EmailBlock, 'id'>[];
}

interface EditorState {
  theme: ThemeSettings;
  blocks: EmailBlock[];
  activeId: string;
  selectedPresetId: string;
}

type DragPayload =
  | { kind: 'new'; blockType: BlockType }
  | { kind: 'existing'; blockId: string };

const BLOCK_LIBRARY: Array<{ type: BlockType; label: string; description: string }> = [
  { type: 'hero', label: 'Hero Banner', description: 'Lead the campaign with a strong headline and CTA.' },
  { type: 'text', label: 'Content Section', description: 'Explain the update with clean, readable supporting copy.' },
  { type: 'image', label: 'Image Spotlight', description: 'Feature a visual banner, product image, or event creative.' },
  { type: 'cta', label: 'CTA Panel', description: 'Repeat the value and guide readers to the next click.' },
  { type: 'divider', label: 'Divider', description: 'Add breathing room between sections without visual clutter.' },
  { type: 'footer', label: 'Footer', description: 'Close with support, preferences, or unsubscribe copy.' },
];

const PRESETS: PresetDefinition[] = [
  {
    id: 'newsletter',
    title: 'Executive Newsletter',
    description: 'A calm, polished digest inspired by official email campaign apps.',
    category: 'Newsletter',
    theme: {
      campaignName: 'Quarterly Product Digest',
      brandName: 'DHEBE Weekly',
      senderName: 'Ariana from DHEBE',
      audienceLabel: 'Subscribers · Product and content updates',
      objective: 'Educate readers and drive one focused click',
      subjectLine: 'Your weekly digest is ready',
      preheader: 'A responsive newsletter layout with clean sections and one focused CTA.',
      accentColor: '#0f172a',
      backgroundColor: '#eef2ff',
      surfaceColor: '#ffffff',
      titleColor: '#020617',
      bodyColor: '#475569',
    },
    blocks: [
      {
        type: 'hero',
        eyebrow: 'Weekly digest',
        title: 'Build a professional newsletter that feels modern and on brand',
        body: 'Share launches, stories, and internal updates with a responsive HTML email that stays readable on mobile and desktop.',
        buttonLabel: 'Read the issue',
        buttonUrl: SITE_URL,
        imageUrl: '',
        altText: '',
        secondaryText: '',
        align: 'left',
        tone: '#f8fafc',
      },
      {
        type: 'text',
        eyebrow: '',
        title: 'Give each section a clear job',
        body: 'The strongest email builders keep each block focused: announce the update, explain the value, and offer one action.',
        buttonLabel: '',
        buttonUrl: '',
        imageUrl: '',
        altText: '',
        secondaryText: '',
        align: 'left',
        tone: '#ffffff',
      },
      {
        type: 'cta',
        eyebrow: '',
        title: 'Close with a primary action',
        body: 'Use one final CTA to guide readers into the campaign page, article, signup flow, or resource hub.',
        buttonLabel: 'Open the campaign',
        buttonUrl: SITE_URL,
        imageUrl: '',
        altText: '',
        secondaryText: '',
        align: 'left',
        tone: '#e0e7ff',
      },
      {
        type: 'footer',
        eyebrow: '',
        title: 'DHEBE Studios',
        body: 'You are receiving this email because you subscribed to product and content updates.',
        buttonLabel: '',
        buttonUrl: '',
        imageUrl: '',
        altText: '',
        secondaryText: 'Reply for support or update your preferences at any time.',
        align: 'left',
        tone: '#ffffff',
      },
    ],
  },
  {
    id: 'welcome',
    title: 'Onboarding Welcome',
    description: 'A clean onboarding template for SaaS, communities, and customer success.',
    category: 'Welcome',
    theme: {
      campaignName: 'Customer Welcome Series',
      brandName: 'DHEBE Onboarding',
      senderName: 'Rina from DHEBE',
      audienceLabel: 'New signups · First 7 days',
      objective: 'Reduce friction and drive activation',
      subjectLine: 'Welcome — here is how to get started',
      preheader: 'Introduce the brand, set expectations, and guide one clear first action.',
      accentColor: '#2563eb',
      backgroundColor: '#eff6ff',
      surfaceColor: '#ffffff',
      titleColor: '#0f172a',
      bodyColor: '#475569',
    },
    blocks: [
      {
        type: 'hero',
        eyebrow: 'Welcome',
        title: 'Help new subscribers feel confident right away',
        body: 'Use a warm, professional welcome email to explain what happens next and point readers to the fastest path to value.',
        buttonLabel: 'Complete setup',
        buttonUrl: SITE_URL,
        imageUrl: '',
        altText: '',
        secondaryText: '',
        align: 'center',
        tone: '#dbeafe',
      },
      {
        type: 'text',
        eyebrow: '',
        title: 'Keep the first message focused',
        body: 'Great onboarding emails introduce the brand, explain the first win, and guide one action with strong spacing.',
        buttonLabel: '',
        buttonUrl: '',
        imageUrl: '',
        altText: '',
        secondaryText: '',
        align: 'left',
        tone: '#ffffff',
      },
      {
        type: 'footer',
        eyebrow: '',
        title: 'DHEBE Studios',
        body: 'This message was sent to help you get more value from your account or subscription.',
        buttonLabel: '',
        buttonUrl: '',
        imageUrl: '',
        altText: '',
        secondaryText: 'Need help? Reply to this email and our team will help.',
        align: 'left',
        tone: '#ffffff',
      },
    ],
  },
  {
    id: 'promotion',
    title: 'Promotional Launch',
    description: 'A sharper sales layout with premium rhythm and conversion-ready CTA blocks.',
    category: 'Promotion',
    theme: {
      campaignName: 'Spring Launch Campaign',
      brandName: 'DHEBE Campaigns',
      senderName: 'Noah from DHEBE',
      audienceLabel: 'High-intent shoppers · Last 30 days',
      objective: 'Drive clicks and lift conversions',
      subjectLine: 'Limited-time offer inside',
      preheader: 'Create a launch email with bold hierarchy, visual focus, and one clear CTA.',
      accentColor: '#db2777',
      backgroundColor: '#fff1f2',
      surfaceColor: '#ffffff',
      titleColor: '#0f172a',
      bodyColor: '#475569',
    },
    blocks: [
      {
        type: 'hero',
        eyebrow: 'Limited offer',
        title: 'Design a launch email that feels premium and conversion-ready',
        body: 'Use a bold headline, a focused value proposition, and one main CTA to move readers from attention to action.',
        buttonLabel: 'Claim the offer',
        buttonUrl: SITE_URL,
        imageUrl: '',
        altText: '',
        secondaryText: '',
        align: 'left',
        tone: '#ffe4e6',
      },
      {
        type: 'image',
        eyebrow: '',
        title: 'Feature your campaign visual',
        body: 'Swap in a product shot, launch creative, or event banner to support the message.',
        buttonLabel: '',
        buttonUrl: '',
        imageUrl: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80',
        altText: 'Campaign visual',
        secondaryText: '',
        align: 'left',
        tone: '#ffffff',
      },
      {
        type: 'cta',
        eyebrow: '',
        title: 'Close with one strong action',
        body: 'Repeat the benefit and give high-intent readers one final place to click before the footer.',
        buttonLabel: 'Shop now',
        buttonUrl: SITE_URL,
        imageUrl: '',
        altText: '',
        secondaryText: '',
        align: 'left',
        tone: '#fce7f3',
      },
      {
        type: 'footer',
        eyebrow: '',
        title: 'DHEBE Studios',
        body: 'You are receiving promotional updates because you joined our list or engaged with our brand.',
        buttonLabel: '',
        buttonUrl: '',
        imageUrl: '',
        altText: '',
        secondaryText: 'Manage preferences or opt out of promotional messages any time.',
        align: 'left',
        tone: '#ffffff',
      },
    ],
  },
];

const SIDEBAR_ITEMS: Array<{ id: SidebarView; label: string; short: string; description: string }> = [
  { id: 'templates', label: 'Templates', short: 'Start', description: 'Choose a professional layout or begin blank.' },
  { id: 'blocks', label: 'Blocks', short: 'Build', description: 'Drag and drop email-safe sections into the canvas.' },
  { id: 'brand', label: 'Brand', short: 'Style', description: 'Control campaign branding, colors, and sender identity.' },
  { id: 'campaign', label: 'Campaign', short: 'Target', description: 'Set audience, subject line, and inbox preview details.' },
];

const WORKSPACE_ITEMS: Array<{ id: WorkspaceView; label: string }> = [
  { id: 'compose', label: 'Compose' },
  { id: 'preview', label: 'Preview' },
  { id: 'html', label: 'HTML' },
];

const INITIAL = instantiatePreset(PRESETS[0]);

export function EmailStudioClient() {
  const [editor, setEditor] = useState<EditorState>(INITIAL);
  const [history, setHistory] = useState<EditorState[]>([]);
  const [future, setFuture] = useState<EditorState[]>([]);
  const [sidebarView, setSidebarView] = useState<SidebarView>('templates');
  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>('compose');
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');
  const [dragPayload, setDragPayload] = useState<DragPayload | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [commandQuery, setCommandQuery] = useState('');
  const [isBooting, setIsBooting] = useState(true);
  const [storageReady, setStorageReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Start from a polished template, then drag blocks into the layout and export clean HTML.');

  const activeBlock = editor.blocks.find((block) => block.id === editor.activeId) ?? null;
  const html = useMemo(() => buildEmailHtml(editor.theme, editor.blocks), [editor.theme, editor.blocks]);
  const query = commandQuery.trim().toLowerCase();
  const filteredPresets = query
    ? PRESETS.filter((preset) =>
        [preset.title, preset.description, preset.category].join(' ').toLowerCase().includes(query),
      )
    : PRESETS;
  const filteredBlocks = query
    ? BLOCK_LIBRARY.filter((block) =>
        [block.label, block.description].join(' ').toLowerCase().includes(query),
      )
    : BLOCK_LIBRARY;

  useEffect(() => {
    try {
      const stored = localStorage.getItem('dhebe-email-editor');
      if (stored) {
        const value = JSON.parse(stored);
        const validTheme = value?.theme && Object.keys(INITIAL.theme).every(key => typeof value.theme[key] === 'string');
        const validBlocks = Array.isArray(value?.blocks) && value.blocks.length < 500 && value.blocks.every((block: EmailBlock) =>
          block && Object.keys(INITIAL.blocks[0]).every(key => typeof block[key as keyof EmailBlock] === 'string') &&
          BLOCK_LIBRARY.some(entry => entry.type === block.type) && ['left', 'center'].includes(block.align));
        if (validTheme && validBlocks && typeof value.activeId === 'string' && typeof value.selectedPresetId === 'string') setEditor(value);
      }
    } catch { setStatusMessage('Saved design could not be restored. You can start a new design.'); }
    setStorageReady(true);
    setIsBooting(false);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      localStorage.setItem('dhebe-email-editor', JSON.stringify(editor));
      setSaved(true);
    } catch { setSaved(false); }
  }, [editor, storageReady]);

  const commitState = (message: string, updater: (current: EditorState) => EditorState) => {
    const next = updater(editor);
    if (serializeEditor(editor) === serializeEditor(next)) return;
    setHistory(previous => [...previous.slice(-39), cloneEditorState(editor)]);
    setFuture([]);
    setEditor(next);
    setStatusMessage(message);
  };

  const updateTheme = <K extends keyof ThemeSettings>(key: K, value: ThemeSettings[K]) => {
    commitState(`${themeLabelFor(key)} updated.`, (current) => ({
      ...current,
      theme: { ...current.theme, [key]: value },
    }));
  };

  const updateActiveBlock = <K extends keyof EmailBlock>(key: K, value: EmailBlock[K]) => {
    if (!activeBlock) {
      return;
    }

    commitState(`${labelFor(activeBlock.type)} updated.`, (current) => ({
      ...current,
      blocks: current.blocks.map((block) => (block.id === current.activeId ? { ...block, [key]: value } : block)),
    }));
  };

  const addBlock = (type: BlockType) => {
    commitState(`${labelFor(type)} added to the layout.`, (current) => {
      const nextBlock = createBlock(type);
      return {
        ...current,
        blocks: [...current.blocks, nextBlock],
        activeId: nextBlock.id,
      };
    });
    setWorkspaceView('compose');
  };

  const duplicateBlock = (blockId: string) => {
    commitState('Section duplicated.', (current) => {
      const index = current.blocks.findIndex((block) => block.id === blockId);
      if (index < 0) {
        return current;
      }
      const clone = { ...current.blocks[index], id: createId(current.blocks[index].type) };
      const nextBlocks = [...current.blocks];
      nextBlocks.splice(index + 1, 0, clone);
      return { ...current, blocks: nextBlocks, activeId: clone.id };
    });
  };

  const removeBlock = (blockId: string) => {
    commitState('Section removed.', (current) => {
      const nextBlocks = current.blocks.filter((block) => block.id !== blockId);
      return {
        ...current,
        blocks: nextBlocks,
        activeId: nextBlocks[0]?.id ?? '',
      };
    });
  };

  const applyPreset = (presetId: string) => {
    const preset = PRESETS.find((entry) => entry.id === presetId);
    if (!preset) {
      return;
    }
    commitState(`${preset.title} preset loaded.`, () => instantiatePreset(preset));
    setSidebarView('brand');
    setWorkspaceView('compose');
  };
  const startFromScratch = () => {
    commitState('Blank workspace loaded.', (current) => {
      const blocks = [createBlock('hero'), createBlock('text'), createBlock('footer')];
      return { ...current, blocks, activeId: blocks[0].id, selectedPresetId: '' };
    });
  };

  const handleDrop = (index: number) => {
    if (!dragPayload) {
      return;
    }

    commitState('Layout order updated.', (current) => {
      const nextBlocks = [...current.blocks];

      if (dragPayload.kind === 'new') {
        const nextBlock = createBlock(dragPayload.blockType);
        nextBlocks.splice(index, 0, nextBlock);
        return { ...current, blocks: nextBlocks, activeId: nextBlock.id };
      }

      const from = nextBlocks.findIndex((block) => block.id === dragPayload.blockId);
      if (from < 0) {
        return current;
      }

      const [moved] = nextBlocks.splice(from, 1);
      const targetIndex = from < index ? index - 1 : index;
      nextBlocks.splice(targetIndex, 0, moved);
      return { ...current, blocks: nextBlocks, activeId: moved.id };
    });

    setDragPayload(null);
    setDropIndex(null);
  };

  const undo = () => {
    if (history.length === 0) {
      return;
    }
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setFuture((prev) => [cloneEditorState(editor), ...prev.slice(0, 39)]);
    setEditor(cloneEditorState(previous));
    setStatusMessage('Previous change restored.');
  };

  const redo = () => {
    if (future.length === 0) {
      return;
    }
    const next = future[0];
    setFuture((prev) => prev.slice(1));
    setHistory((prev) => [...prev.slice(-39), cloneEditorState(editor)]);
    setEditor(cloneEditorState(next));
    setStatusMessage('Change reapplied.');
  };

  const copyHtml = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setStatusMessage('HTML copied to the clipboard.');
    } catch {
      setStatusMessage('Clipboard access is unavailable. Use the HTML panel to copy the code manually.');
    }
  };

  const downloadHtml = () => {
    const blob = new Blob([html], { type: 'text/html' });
    downloadBlob(blob, `${slugify(editor.theme.campaignName || editor.theme.brandName || 'email-template')}.html`);
    setStatusMessage('HTML template downloaded.');
  };

  const activePreset = PRESETS.find((preset) => preset.id === editor.selectedPresetId)?.title ?? 'Custom layout';

  if (isBooting) {
    return <EditorShellSkeleton />;
  }

  return (
    <section id="email-editor" className="space-y-5">
      <div className="overflow-hidden rounded-[2.25rem] border theme-panel">
        <div className="border-b border-slate-800 bg-slate-950 px-4 py-4 text-white sm:px-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-950">
                DHEBE Editor
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                Campaign workspace
              </span>
              <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                {saved ? 'Saved on this device' : 'Unsaved changes'}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-3 xl:max-w-[42rem] xl:flex-row xl:items-center">
              <label className="flex flex-1 items-center gap-3 rounded-full border border-white/10 bg-white px-4 py-3 text-sm shadow-sm">
                <span className="text-slate-400">⌕</span>
                <input
                  value={commandQuery}
                  onChange={(event) => setCommandQuery(event.target.value)}
                  placeholder="Search templates, blocks, or campaign controls"
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </label>
              <div className="flex gap-2">
                {['Plan', 'Design', 'Review'].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-0 xl:grid-cols-[18.5rem_minmax(0,1fr)]">
          <aside className="theme-rail border-b border-[var(--app-card-border)] p-4 xl:sticky xl:top-24 xl:h-[calc(100vh-7rem)] xl:overflow-auto xl:border-b-0 xl:border-r">
            <div className="rounded-[1.8rem] border p-4 theme-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">Email Builder</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight theme-title">Make it your own</h2>
                </div>
                <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                  Live
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 theme-muted">
                Start with a template, add your content, and fine-tune your brand.
              </p>

              <div className="mt-5 grid gap-2">
                {SIDEBAR_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSidebarView(item.id)}
                    className={`rounded-[1.1rem] border px-4 py-3 text-left transition ${
                      sidebarView === item.id ? 'border-sky-300 bg-sky-50 shadow-sm' : 'theme-card-soft hover:border-sky-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold theme-title">{item.label}</span>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] theme-muted-2">{item.short}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 theme-muted">{item.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-[1.8rem] border p-4 theme-card">
          {sidebarView === 'templates' ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] theme-muted-2">Template gallery</p>
                  <h3 className="mt-2 text-lg font-semibold theme-title">Start from a polished layout</h3>
                </div>
                <button
                  onClick={startFromScratch}
                  className="rounded-full border border-[var(--app-card-border)] px-3 py-1.5 text-xs font-semibold theme-title transition hover:bg-sky-50"
                >
                  Start blank
                </button>
              </div>
              <div className="mt-4 grid gap-3">
                {filteredPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset.id)}
                    className={`rounded-[1.35rem] border p-4 text-left transition ${
                      editor.selectedPresetId === preset.id ? 'border-sky-300 bg-sky-50 shadow-sm' : 'theme-card-soft hover:border-sky-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold theme-title">{preset.title}</p>
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">{preset.category}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 theme-muted">{preset.description}</p>
                  </button>
                ))}
                {filteredPresets.length === 0 ? (
                  <EmptySidebarState message="No matching templates. Try another keyword or start from a blank layout." />
                ) : null}
              </div>
            </>
          ) : null}

          {sidebarView === 'blocks' ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] theme-muted-2">Drag and drop</p>
              <h3 className="mt-2 text-lg font-semibold theme-title">Add sections to your campaign</h3>
              <p className="mt-3 text-sm leading-7 theme-muted">Drag blocks into the canvas or add them with one click.</p>
              <div className="mt-4 grid gap-3">
                {filteredBlocks.map((item) => (
                  <div
                    key={item.type}
                    draggable
                    onDragStart={() => setDragPayload({ kind: 'new', blockType: item.type })}
                    onDragEnd={() => {
                      setDragPayload(null);
                      setDropIndex(null);
                    }}
                    className="rounded-[1.35rem] border p-4 theme-card-soft transition hover:border-sky-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold theme-title">{item.label}</p>
                        <p className="mt-2 text-sm leading-6 theme-muted">{item.description}</p>
                      </div>
                      <button
                        onClick={() => addBlock(item.type)}
                        className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
                {filteredBlocks.length === 0 ? (
                  <EmptySidebarState message="No matching blocks found. Clear the search to see the full block library." />
                ) : null}
              </div>
            </>
          ) : null}

          {sidebarView === 'brand' ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] theme-muted-2">Brand controls</p>
              <h3 className="mt-2 text-lg font-semibold theme-title">Match the template to your brand</h3>
              <div className="mt-4 space-y-3">
                <TextField label="Brand Name" value={editor.theme.brandName} onChange={(value) => updateTheme('brandName', value)} />
                <TextField label="Campaign Name" value={editor.theme.campaignName} onChange={(value) => updateTheme('campaignName', value)} />
                <TextField label="Sender Name" value={editor.theme.senderName} onChange={(value) => updateTheme('senderName', value)} />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <ColorField label="Accent" value={editor.theme.accentColor} onChange={(value) => updateTheme('accentColor', value)} />
                <ColorField label="Canvas" value={editor.theme.backgroundColor} onChange={(value) => updateTheme('backgroundColor', value)} />
                <ColorField label="Card" value={editor.theme.surfaceColor} onChange={(value) => updateTheme('surfaceColor', value)} />
                <ColorField label="Heading" value={editor.theme.titleColor} onChange={(value) => updateTheme('titleColor', value)} />
              </div>
            </>
          ) : null}

          {sidebarView === 'campaign' ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] theme-muted-2">Campaign setup</p>
              <h3 className="mt-2 text-lg font-semibold theme-title">Subject line, audience, and objective</h3>
              <div className="mt-4 space-y-3">
                <TextField label="Audience" value={editor.theme.audienceLabel} onChange={(value) => updateTheme('audienceLabel', value)} />
                <TextField label="Objective" value={editor.theme.objective} onChange={(value) => updateTheme('objective', value)} />
                <TextField label="Subject Line" value={editor.theme.subjectLine} onChange={(value) => updateTheme('subjectLine', value)} />
                <TextAreaField label="Preheader" value={editor.theme.preheader} rows={3} onChange={(value) => updateTheme('preheader', value)} />
                <ColorField label="Body Text" value={editor.theme.bodyColor} onChange={(value) => updateTheme('bodyColor', value)} />
              </div>
            </>
          ) : null}
            </div>

            <div className="mt-5 rounded-[1.8rem] border p-4 theme-card-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-600">Workflow note</p>
              <p className="mt-3 text-sm leading-7 theme-muted">
                Keep your design on this device, preview it at different sizes, and export the HTML when it is ready.
              </p>
            </div>
          </aside>

          <div className="email-editor-stage min-w-0 p-4 sm:p-5">
            <div className="email-stage-frame border p-5 theme-card">
              <div className="email-campaign-header mb-5 px-5 py-5 text-white">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-950">{activePreset}</span>
                      <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">{editor.blocks.length} sections</span>
                      <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">Responsive HTML</span>
                    </div>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-sky-200">Editor stage</p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">{editor.theme.campaignName}</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">{editor.theme.objective}</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <MetricCard label="Audience" value={editor.theme.audienceLabel} />
                      <MetricCard label="Sender" value={editor.theme.senderName} />
                      <MetricCard label="Subject" value={editor.theme.subjectLine} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button onClick={undo} disabled={history.length === 0} className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50">Undo</button>
                    <button onClick={redo} disabled={future.length === 0} className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50">Redo</button>
                    <button onClick={copyHtml} className="rounded-full border border-sky-300/30 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-100 transition hover:bg-sky-400/20">Copy HTML</button>
                    <button onClick={downloadHtml} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90">Download HTML</button>
                  </div>
                </div>

                <div className="mt-5 rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-200">Workspace status</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{statusMessage}</p>
                </div>
              </div>

              <div className="space-y-6">
        <section className="rounded-[1.7rem] border p-5 theme-card">
          <div className="flex flex-col gap-4 border-b border-[var(--app-card-border)] pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] theme-muted-2">Workspace</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight theme-title">Design, preview, and export in one focused flow</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {WORKSPACE_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setWorkspaceView(item.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    workspaceView === item.id ? 'bg-slate-950 text-white' : 'border border-[var(--app-card-border)] theme-title hover:bg-sky-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {workspaceView === 'compose' ? (
            <div className="mt-6 space-y-6">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {[
                  'Focused hierarchy',
                  'Brand consistency',
                  'Inbox readiness',
                  'HTML handoff',
                ].map((item) => (
                  <div key={item} className="rounded-[1.4rem] border p-4 theme-card-soft">
                    <p className="text-sm font-semibold theme-title">{item}</p>
                    <p className="mt-2 text-sm leading-6 theme-muted">Build with one clear purpose per section and keep the message easy to scan.</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[1.7rem] border p-5 theme-card">
                <div className="flex flex-col gap-3 border-b border-[var(--app-card-border)] pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] theme-muted-2">Canvas</p>
                    <h3 className="mt-2 text-xl font-semibold theme-title">Arrange content blocks like an official email app</h3>
                  </div>
                  <button onClick={() => setSidebarView('blocks')} className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100">Open block library</button>
                </div>

                <div className="mt-5 space-y-3">
                  <DropZone active={dropIndex === 0} onDragOver={() => setDropIndex(0)} onDrop={() => handleDrop(0)} />
                  {editor.blocks.map((block, index) => (
                    <Fragment key={block.id}>
                      <div
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setEditor(current => ({ ...current, activeId: block.id })); } }}
                        draggable
                        onDragStart={() => setDragPayload({ kind: 'existing', blockId: block.id })}
                        onDragEnd={() => {
                          setDragPayload(null);
                          setDropIndex(null);
                        }}
                        onClick={() => setEditor((current) => ({ ...current, activeId: block.id }))}
                        className={`w-full rounded-[1.5rem] border p-5 text-left transition ${
                          editor.activeId === block.id ? 'border-sky-300 bg-sky-50 shadow-sm' : 'theme-card-soft hover:border-sky-200'
                        }`}
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">{labelFor(block.type)}</span>
                              {block.type !== 'divider' ? <span className="rounded-full border border-[var(--app-card-border)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] theme-muted-2">{block.align}</span> : null}
                            </div>
                            <p className="mt-3 text-lg font-semibold theme-title">{block.title || 'Untitled section'}</p>
                            <p className="mt-2 text-sm leading-6 theme-muted">{summaryFor(block)}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full border border-sky-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">Drag</span>
                            <button onClick={(event) => { event.stopPropagation(); duplicateBlock(block.id); }} className="rounded-full border border-[var(--app-card-border)] px-3 py-1 text-xs font-semibold theme-title transition hover:bg-sky-50">Duplicate</button>
                            <button onClick={(event) => { event.stopPropagation(); removeBlock(block.id); }} className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-50">Remove</button>
                          </div>
                        </div>
                      </div>
                      <DropZone active={dropIndex === index + 1} onDragOver={() => setDropIndex(index + 1)} onDrop={() => handleDrop(index + 1)} />
                    </Fragment>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
                <div className="rounded-[1.7rem] border p-5 theme-card">
                  <div className="flex flex-col gap-3 border-b border-[var(--app-card-border)] pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] theme-muted-2">Section editor</p>
                      <h3 className="mt-2 text-xl font-semibold theme-title">{activeBlock ? `Edit ${labelFor(activeBlock.type)}` : 'Select a section'}</h3>
                    </div>
                  </div>

                  {!activeBlock ? (
                    <p className="mt-5 text-sm leading-7 theme-muted">Choose a section in the canvas to update copy, visuals, CTA labels, alignment, or footer details.</p>
                  ) : (
                    <div className="mt-5 space-y-4">
                      {activeBlock.type === 'hero' ? <TextField label="Eyebrow" value={activeBlock.eyebrow} onChange={(value) => updateActiveBlock('eyebrow', value)} /> : null}

                      {activeBlock.type !== 'divider' ? (
                        <>
                          <TextField label={activeBlock.type === 'footer' ? 'Brand Name' : 'Heading'} value={activeBlock.title} onChange={(value) => updateActiveBlock('title', value)} />
                          <TextAreaField label={activeBlock.type === 'image' ? 'Caption' : 'Body Copy'} value={activeBlock.body} rows={activeBlock.type === 'footer' ? 4 : 5} onChange={(value) => updateActiveBlock('body', value)} />
                        </>
                      ) : null}

                      {activeBlock.type === 'footer' ? <TextAreaField label="Secondary Line" value={activeBlock.secondaryText} rows={3} onChange={(value) => updateActiveBlock('secondaryText', value)} /> : null}

                      {activeBlock.type === 'image' ? (
                        <>
                          <TextField label="Image URL" value={activeBlock.imageUrl} onChange={(value) => updateActiveBlock('imageUrl', value)} />
                          <TextField label="Alt Text" value={activeBlock.altText} onChange={(value) => updateActiveBlock('altText', value)} />
                        </>
                      ) : null}

                      {activeBlock.type === 'hero' || activeBlock.type === 'cta' ? (
                        <>
                          <div className="grid gap-3 md:grid-cols-2">
                            <TextField label="Button Label" value={activeBlock.buttonLabel} onChange={(value) => updateActiveBlock('buttonLabel', value)} />
                            <TextField label="Button URL" value={activeBlock.buttonUrl} onChange={(value) => updateActiveBlock('buttonUrl', value)} />
                          </div>
                          <SelectField
                            label="Alignment"
                            value={activeBlock.align}
                            onChange={(value) => updateActiveBlock('align', value as Align)}
                            options={[{ value: 'left', label: 'Left aligned' }, { value: 'center', label: 'Centered' }]}
                          />
                          <ColorField label="Section Tone" value={activeBlock.tone} onChange={(value) => updateActiveBlock('tone', value)} />
                        </>
                      ) : null}

                      {activeBlock.type === 'text' ? <SelectField label="Alignment" value={activeBlock.align} onChange={(value) => updateActiveBlock('align', value as Align)} options={[{ value: 'left', label: 'Left aligned' }, { value: 'center', label: 'Centered' }]} /> : null}

                      {activeBlock.type === 'divider' ? (
                        <div className="rounded-[1.35rem] border p-4 theme-card-soft">
                          <p className="text-sm leading-6 theme-muted">Divider blocks create breathing room between major email sections and help the layout feel less crowded.</p>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="rounded-[1.7rem] border p-5 theme-card">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">Inbox preview</p>
                    <div className="mt-4 rounded-[1.4rem] border bg-white p-4">
                      <p className="text-sm font-semibold text-slate-950">{editor.theme.senderName}</p>
                      <p className="mt-1 text-sm font-medium text-slate-950">{editor.theme.subjectLine}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{editor.theme.preheader}</p>
                    </div>
                  </div>

                  <div className="rounded-[1.7rem] border p-5 theme-card">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">QA checklist</p>
                    <div className="mt-4 space-y-3">
                      {qualityChecklist(editor.blocks, editor.theme).map((item) => (
                        <div key={item.label} className="rounded-[1.2rem] border p-4 theme-card-soft">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold theme-title">{item.label}</p>
                            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${item.good ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{item.good ? 'Ready' : 'Review'}</span>
                          </div>
                          <p className="mt-2 text-sm leading-6 theme-muted">{item.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {workspaceView === 'preview' ? (
            <div className="mt-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] theme-muted-2">Live preview</p>
                  <h3 className="mt-2 text-xl font-semibold theme-title">Validate the design on desktop and mobile</h3>
                </div>
                <div className="flex gap-2">
                  {(['desktop', 'mobile'] as PreviewDevice[]).map((device) => (
                    <button
                      key={device}
                      onClick={() => setPreviewDevice(device)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        previewDevice === device ? 'bg-slate-950 text-white' : 'border border-[var(--app-card-border)] theme-title hover:bg-sky-50'
                      }`}
                    >
                      {device === 'desktop' ? 'Desktop' : 'Mobile'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.7rem] border p-5 theme-card-soft">
                <div className="grid gap-5 xl:grid-cols-[20rem_minmax(0,1fr)]">
                  <div className="space-y-4">
                    <div className="rounded-[1.4rem] border bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">Subject line</p>
                      <p className="mt-2 text-base font-semibold text-slate-950">{editor.theme.subjectLine}</p>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{editor.theme.preheader}</p>
                    </div>

                    <div className="rounded-[1.4rem] border p-4 theme-card">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-600">Campaign context</p>
                      <div className="mt-3 space-y-3">
                        <MetricLine label="Audience" value={editor.theme.audienceLabel} />
                        <MetricLine label="Sender" value={editor.theme.senderName} />
                        <MetricLine label="Brand" value={editor.theme.brandName} />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.4rem] border bg-white p-3">
                    <div className={previewDevice === 'mobile' ? 'mx-auto w-[375px] max-w-full' : 'w-full'}>
                      <iframe title="Email template preview" sandbox="" referrerPolicy="no-referrer" srcDoc={html} className="h-[42rem] w-full rounded-[1rem] border bg-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {workspaceView === 'html' ? (
            <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_19rem]">
              <div className="rounded-[1.7rem] border p-5 theme-card-soft">
                <div className="flex flex-col gap-3 border-b border-[var(--app-card-border)] pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] theme-muted-2">HTML export</p>
                    <h3 className="mt-2 text-xl font-semibold theme-title">Copy or download the responsive email HTML</h3>
                  </div>
                  <button onClick={copyHtml} className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100">Copy code</button>
                </div>
                <pre className="mt-5 max-h-[42rem] overflow-auto whitespace-pre-wrap break-words rounded-[1.2rem] border bg-slate-950 p-4 text-xs leading-6 text-slate-100">{html}</pre>
              </div>

              <div className="rounded-[1.7rem] border p-5 theme-card">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-600">Export tips</p>
                <div className="mt-4 space-y-3">
                  {[
                    'Test the HTML inside your ESP or staging flow before sending.',
                    'Keep one primary CTA so the action stays obvious.',
                    'Use descriptive alt text when you include images.',
                  ].map((tip) => (
                    <div key={tip} className="rounded-[1.2rem] border p-4 theme-card-soft">
                      <p className="text-sm leading-6 theme-muted">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DropZone({ active, onDragOver, onDrop }: { active: boolean; onDragOver: () => void; onDrop: () => void }) {
  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        onDragOver();
      }}
      onDrop={(event) => {
        event.preventDefault();
        onDrop();
      }}
      className={`rounded-full border border-dashed px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.2em] transition ${
        active ? 'border-sky-400 bg-sky-50 text-sky-700' : 'border-transparent bg-transparent text-transparent'
      }`}
    >
      Drop section here
    </div>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold theme-title">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="theme-card w-full rounded-xl border px-3 py-2.5 text-sm theme-title" />
    </label>
  );
}

function TextAreaField({ label, value, rows, onChange }: { label: string; value: string; rows: number; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold theme-title">{label}</span>
      <textarea value={value} rows={rows} onChange={(event) => onChange(event.target.value)} className="theme-card w-full rounded-xl border px-3 py-2.5 text-sm theme-title" />
    </label>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: Array<{ value: string; label: string }>; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold theme-title">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="theme-card w-full rounded-xl border px-3 py-2.5 text-sm theme-title">
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold theme-title">{label}</span>
      <div className="theme-card flex items-center gap-3 rounded-xl border px-3 py-2.5">
        <input type="color" value={value} onChange={(event) => onChange(event.target.value)} className="h-8 w-10 rounded border-0 bg-transparent p-0" />
        <span className="text-sm font-medium theme-title">{value}</span>
      </div>
    </label>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border p-4 theme-card-soft">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] theme-muted-2">{label}</p>
      <p className="mt-2 text-sm font-semibold theme-title">{value}</p>
    </div>
  );
}

function MetricLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] theme-muted-2">{label}</p>
      <p className="mt-1 text-sm font-semibold theme-title">{value}</p>
    </div>
  );
}

function EmptySidebarState({ message }: { message: string }) {
  return (
    <div className="rounded-[1.35rem] border border-dashed p-4 theme-card-soft">
      <p className="text-sm leading-6 theme-muted">{message}</p>
    </div>
  );
}

function EditorShellSkeleton() {
  return (
    <section id="email-editor" className="space-y-5">
      <div className="overflow-hidden rounded-[2.25rem] border theme-panel">
        <div className="border-b border-slate-800 bg-slate-950 px-4 py-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex gap-3">
              <div className="h-9 w-32 animate-pulse rounded-full bg-white/80" />
              <div className="h-9 w-36 animate-pulse rounded-full bg-white/10" />
            </div>
            <div className="h-12 w-full animate-pulse rounded-full bg-white xl:max-w-[42rem]" />
          </div>
        </div>

        <div className="grid gap-0 xl:grid-cols-[18.5rem_minmax(0,1fr)]">
          <div className="theme-rail border-b border-[var(--app-card-border)] p-4 xl:border-b-0 xl:border-r">
            <div className="rounded-[1.8rem] border p-4 theme-card">
              <div className="space-y-3">
                <div className="h-5 w-24 animate-pulse rounded-full bg-slate-200/70" />
                <div className="h-9 w-48 animate-pulse rounded-2xl bg-slate-200/80" />
                <div className="h-20 animate-pulse rounded-[1.5rem] bg-slate-200/60" />
              </div>
              <div className="mt-5 grid gap-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-20 animate-pulse rounded-[1.35rem] bg-slate-200/60" />
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-[1.8rem] border p-4 theme-card">
              <div className="h-6 w-40 animate-pulse rounded-full bg-slate-200/70" />
              <div className="mt-4 grid gap-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-24 animate-pulse rounded-[1.35rem] bg-slate-200/60" />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.08),_transparent_28%),linear-gradient(180deg,_rgba(248,250,252,0.96)_0%,_rgba(255,255,255,0.96)_100%)] p-4 sm:p-5">
            <div className="rounded-[1.9rem] border-2 border-slate-200/80 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
              <div className="rounded-[1.6rem] bg-slate-950 px-5 py-5">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="h-8 w-24 animate-pulse rounded-full bg-white/80" />
                    <div className="h-8 w-28 animate-pulse rounded-full bg-white/10" />
                    <div className="h-8 w-32 animate-pulse rounded-full bg-white/10" />
                  </div>
                  <div className="h-10 w-72 animate-pulse rounded-2xl bg-white/80" />
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="h-20 animate-pulse rounded-[1.2rem] bg-white/10" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div className="h-10 w-64 animate-pulse rounded-2xl bg-slate-200/80" />
                <div className="grid gap-4 xl:grid-cols-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="h-24 animate-pulse rounded-[1.4rem] bg-slate-200/60" />
                  ))}
                </div>
                <div className="h-[34rem] animate-pulse rounded-[1.7rem] bg-slate-200/50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function instantiatePreset(preset: PresetDefinition): EditorState {
  const blocks = preset.blocks.map((block) => ({ ...block, id: createId(block.type) }));
  return { theme: { ...preset.theme }, blocks, activeId: blocks[0]?.id ?? '', selectedPresetId: preset.id };
}

function createBlock(type: BlockType): EmailBlock {
  return {
    id: createId(type),
    type,
    eyebrow: type === 'hero' ? 'New section' : '',
    title:
      type === 'footer'
        ? 'Your brand'
        : type === 'divider'
          ? 'Divider'
          : type === 'image'
            ? 'Show a visual highlight'
            : 'Add a professional section title',
    body:
      type === 'divider'
        ? ''
        : type === 'footer'
          ? 'You are receiving this email because you signed up for updates or purchased from our brand.'
          : 'Use this section to explain the value, share an update, or guide the reader toward the next step.',
    buttonLabel: type === 'hero' || type === 'cta' ? 'Take action' : '',
    buttonUrl: type === 'hero' || type === 'cta' ? SITE_URL : '',
    imageUrl: type === 'image' ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80' : '',
    altText: type === 'image' ? 'Email campaign visual' : '',
    secondaryText: type === 'footer' ? 'Add support details, preferences, or unsubscribe instructions here.' : '',
    align: 'left',
    tone: type === 'hero' ? '#f8fafc' : type === 'cta' ? '#eff6ff' : '#ffffff',
  };
}

function createId(type: BlockType) {
  return `${type}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}

function labelFor(type: BlockType) {
  return BLOCK_LIBRARY.find((item) => item.type === type)?.label ?? 'Section';
}

function summaryFor(block: EmailBlock) {
  if (block.type === 'divider') {
    return 'Adds breathing room between major email sections.';
  }
  if (block.type === 'image') {
    return block.body || 'Visual block ready for a campaign image.';
  }
  return block.body || 'Click to edit this section.';
}

function themeLabelFor(key: keyof ThemeSettings) {
  const labels: Record<keyof ThemeSettings, string> = {
    campaignName: 'Campaign name',
    brandName: 'Brand name',
    senderName: 'Sender name',
    audienceLabel: 'Audience',
    objective: 'Objective',
    subjectLine: 'Subject line',
    preheader: 'Preheader',
    accentColor: 'Accent color',
    backgroundColor: 'Canvas color',
    surfaceColor: 'Card color',
    titleColor: 'Heading color',
    bodyColor: 'Body color',
  };
  return labels[key];
}

function qualityChecklist(blocks: EmailBlock[], theme: ThemeSettings) {
  const hasPrimaryCta = blocks.some((block) => (block.type === 'hero' || block.type === 'cta') && block.buttonLabel.trim() && block.buttonUrl.trim());
  const hasFooter = blocks.some((block) => block.type === 'footer');
  const concisePreheader = theme.preheader.trim().length > 0 && theme.preheader.trim().length <= 140;

  return [
    {
      label: 'Primary CTA',
      good: hasPrimaryCta,
      detail: hasPrimaryCta ? 'The layout includes at least one actionable button.' : 'Add a CTA block or hero button so readers know what to do next.',
    },
    {
      label: 'Inbox preview text',
      good: concisePreheader,
      detail: concisePreheader ? 'The preheader is present and sized well for inbox snippets.' : 'Add a preheader under 140 characters for stronger inbox context.',
    },
    {
      label: 'Footer and support copy',
      good: hasFooter,
      detail: hasFooter ? 'The footer is ready for brand and support details.' : 'Add a footer block so the email ends with clear brand and support information.',
    },
  ];
}

function cloneEditorState(state: EditorState): EditorState {
  return JSON.parse(JSON.stringify(state)) as EditorState;
}

function serializeEditor(state: EditorState) {
  return JSON.stringify(state);
}

function buildEmailHtml(theme: ThemeSettings, blocks: EmailBlock[]) {
  const content = blocks.map((block) => renderBlockHtml(block, theme)).join('');
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(theme.subjectLine)}</title>
  <style>
    @media screen and (max-width: 620px) {
      .email-shell { width: 100% !important; border-radius: 18px !important; }
      .email-pad { padding: 24px 18px !important; }
      .mobile-full { width: 100% !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:${theme.backgroundColor};font-family:Arial,sans-serif;color:${theme.bodyColor};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(theme.preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${theme.backgroundColor};padding:28px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="email-shell" style="width:100%;max-width:600px;background:${theme.surfaceColor};border-radius:24px;overflow:hidden;">
          <tr>
            <td style="background:${theme.accentColor};padding:28px 32px;color:#ffffff;">
              <p style="margin:0;font-size:12px;line-height:1.5;letter-spacing:0.18em;text-transform:uppercase;opacity:0.82;">${escapeHtml(theme.subjectLine)}</p>
              <p style="margin:10px 0 0 0;font-size:24px;line-height:1.3;font-weight:700;">${escapeHtml(theme.brandName)}</p>
              <p style="margin:8px 0 0 0;font-size:14px;line-height:1.7;opacity:0.92;">${escapeHtml(theme.preheader)}</p>
            </td>
          </tr>
          <tr>
            <td class="email-pad" style="padding:32px;">${content}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function renderBlockHtml(block: EmailBlock, theme: ThemeSettings) {
  if (block.type === 'hero') {
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 26px 0;background:${block.tone};border-radius:20px;"><tr><td style="padding:28px;"><p style="margin:0 0 12px 0;font-size:12px;line-height:1.5;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:${theme.accentColor};text-align:${block.align};">${escapeHtml(block.eyebrow)}</p><h1 style="margin:0 0 14px 0;font-size:32px;line-height:1.2;font-weight:700;color:${theme.titleColor};text-align:${block.align};">${formatText(block.title)}</h1><p style="margin:0 0 20px 0;font-size:16px;line-height:1.8;color:${theme.bodyColor};text-align:${block.align};">${formatText(block.body)}</p>${renderButton(block.buttonLabel, block.buttonUrl, theme.accentColor, block.align)}</td></tr></table>`;
  }

  if (block.type === 'text') {
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;"><tr><td><h2 style="margin:0 0 12px 0;font-size:24px;line-height:1.3;font-weight:700;color:${theme.titleColor};text-align:${block.align};">${formatText(block.title)}</h2><p style="margin:0;font-size:16px;line-height:1.8;color:${theme.bodyColor};text-align:${block.align};">${formatText(block.body)}</p></td></tr></table>`;
  }

  if (block.type === 'image') {
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;"><tr><td><h2 style="margin:0 0 14px 0;font-size:24px;line-height:1.3;font-weight:700;color:${theme.titleColor};">${formatText(block.title)}</h2><img src="${escapeHtml(safeUrl(block.imageUrl))}" alt="${escapeHtml(block.altText)}" class="mobile-full" style="display:block;width:100%;max-width:536px;height:auto;border:0;border-radius:18px;" /><p style="margin:14px 0 0 0;font-size:14px;line-height:1.7;color:${theme.bodyColor};">${formatText(block.body)}</p></td></tr></table>`;
  }

  if (block.type === 'cta') {
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px 0;background:${block.tone};border-radius:20px;"><tr><td style="padding:28px;"><h2 style="margin:0 0 12px 0;font-size:24px;line-height:1.3;font-weight:700;color:${theme.titleColor};text-align:${block.align};">${formatText(block.title)}</h2><p style="margin:0 0 20px 0;font-size:16px;line-height:1.8;color:${theme.bodyColor};text-align:${block.align};">${formatText(block.body)}</p>${renderButton(block.buttonLabel, block.buttonUrl, theme.accentColor, block.align)}</td></tr></table>`;
  }

  if (block.type === 'divider') {
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;"><tr><td><hr style="border:none;border-top:1px solid #e2e8f0;margin:0;" /></td></tr></table>`;
  }

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0;"><tr><td style="padding-top:12px;"><p style="margin:0 0 10px 0;font-size:14px;line-height:1.7;font-weight:700;color:${theme.titleColor};">${escapeHtml(block.title)}</p><p style="margin:0 0 8px 0;font-size:12px;line-height:1.8;color:${theme.bodyColor};">${formatText(block.body)}</p><p style="margin:0;font-size:12px;line-height:1.8;color:${theme.bodyColor};">${formatText(block.secondaryText)}</p></td></tr></table>`;
}

function renderButton(label: string, url: string, color: string, align: Align) {
  const target = align === 'center' ? 'center' : 'left';
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="${target === 'center' ? 'margin-left:auto;margin-right:auto;' : ''}"><tr><td align="${target}"><a href="${escapeHtml(safeUrl(url))}" style="display:inline-block;background:${color};color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:999px;font-size:14px;font-weight:700;line-height:1.2;">${escapeHtml(label || 'Open')}</a></td></tr></table>`;
}

function safeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return '#';
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:') || trimmed.startsWith('#') || trimmed.startsWith('/')) {
    return trimmed;
  }
  return `https://${trimmed.replace(/^\/+/, '')}`;
}

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function formatText(value: string) {
  return escapeHtml(value).replace(/\n/g, '<br />');
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'email-template';
}
