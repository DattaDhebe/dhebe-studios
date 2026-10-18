import { startStaticPreview } from '../scripts/serve-static.mjs';

// Reproduce shared hosting's .mjs MIME behavior in browser regressions.
await startStaticPreview({ port: 3100, mjsType: 'text/plain' });
