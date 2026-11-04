import { ImageResponse } from 'next/og';
import { SITE_NAME, SITE_ROLE, SITE_URL } from '@/lib/site';

export const alt = `${SITE_NAME} | ${SITE_ROLE}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#05020a',
          padding: '80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* Subtle radial ambient gradients matching site's pink/purple accents */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-120px',
            width: '650px',
            height: '650px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(192, 132, 252, 0.22) 0%, rgba(244, 114, 182, 0.12) 40%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-150px',
            left: '-150px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%)',
          }}
        />

        {/* Top status bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(192, 132, 252, 0.25)',
              borderRadius: '9999px',
              padding: '8px 20px',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#4ade80',
              }}
            />
            <span
              style={{
                color: '#faf5ff',
                fontSize: '16px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              Available for opportunities
            </span>
          </div>

          <span
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#c084fc',
              letterSpacing: '0.1em',
            }}
          >
            HK
          </span>
        </div>

        {/* Center content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <span
            style={{
              color: '#d8b4fe',
              fontSize: '22px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
            }}
          >
            PORTFOLIO
          </span>
          <h1
            style={{
              fontSize: '84px',
              fontWeight: 700,
              color: '#faf5ff',
              lineHeight: 1.05,
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            {SITE_NAME}
          </h1>
          <p
            style={{
              fontSize: '32px',
              color: '#d8b4fe',
              lineHeight: 1.3,
              margin: 0,
              maxWidth: '960px',
            }}
          >
            {SITE_ROLE}
          </p>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(192, 132, 252, 0.2)',
            paddingTop: '32px',
          }}
        >
          <span style={{ fontSize: '24px', color: '#c084fc', letterSpacing: '0.05em' }}>
            {SITE_URL.replace(/^https?:\/\//, '')}
          </span>
          <span style={{ fontSize: '20px', color: '#a78bfa', letterSpacing: '0.1em' }}>
            DTU · Systems · Full-Stack · ML
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
