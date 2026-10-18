import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
const size = { width: 1200, height: 630 };

export function GET() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: 70, background: '#f7f7f2', color: '#202722', fontFamily: 'sans-serif', backgroundImage: 'radial-gradient(circle at 95% 10%, #e2e9d8, transparent 65%)' }}>
      <div style={{ display: 'flex', alignItems: 'center', fontSize: 26, letterSpacing: 6 }}>DHEBE STUDIOS</div>
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 50, fontSize: 88, fontWeight: 700, letterSpacing: -5, lineHeight: 1.08 }}><span>Your everyday</span><span style={{ color: '#4b713d' }}>shortcut.</span></div>
      <div style={{ display: 'flex', marginTop: 35, fontSize: 27 }}>PDF / Images / Text / QR codes / Base64 / Calculators</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', fontSize: 22, color: '#60665f' }}><span>Free tools. No account needed.</span><span>www.dhebe.com</span></div>
    </div>, size,
  );
}
