import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';

export function GET() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: 65, background: '#f7f7f2', color: '#202722', fontFamily: 'sans-serif', backgroundImage: 'radial-gradient(circle at 95% 10%, #e9d9ca 0%, #f7f7f2 70%)' }}>
      <div style={{ display: 'flex', fontSize: 25, letterSpacing: 5 }}>DHEBE STUDIOS</div>
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 44, fontSize: 82, fontWeight: 700, letterSpacing: -4, lineHeight: 1.08 }}><span>Free online tools.</span><span style={{ color: '#a64c32' }}>Less busywork.</span></div>
      <div style={{ display: 'flex', marginTop: 30, fontSize: 25 }}>PDF / Images / Base64 / Calculators / Email</div>
      <div style={{ display: 'flex', marginTop: 26, fontSize: 26, color: '#703f3b' }}>Discover Milan - our marriage biodata maker.</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', fontSize: 21, color: '#60665f' }}><span>Useful tools. Thoughtful introductions.</span><span>www.dhebe.com</span></div>
    </div>, { width: 1200, height: 630 },
  );
}
