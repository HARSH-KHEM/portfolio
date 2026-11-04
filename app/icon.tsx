import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
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
          borderRadius: '6px',
          border: '1px solid rgba(192, 132, 252, 0.4)',
        }}
      >
        <span
          style={{
            fontSize: '20px',
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
