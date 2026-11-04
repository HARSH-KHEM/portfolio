import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0c',
          borderRadius: '36px',
          border: '4px solid rgba(192, 132, 252, 0.4)',
        }}
      >
        <span
          style={{
            fontSize: '110px',
            fontWeight: 700,
            color: '#c084fc',
            fontFamily: 'system-ui, sans-serif',
            lineHeight: 1,
          }}
        >
          H
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
