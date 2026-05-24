import { ImageResponse } from 'next/og';
import frenchLogo from '../../french-logo.png';

export const size = {
  width: 512,
  height: 512,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
        }}
      >
        <img
          src={frenchLogo.src}
          alt="French logo"
          width="512"
          height="512"
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
