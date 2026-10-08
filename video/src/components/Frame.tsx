import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {FPS} from '../theme';
import {theme} from '../theme';

export type TimedCaption = {text: string; start: number; end: number};
export type SceneProps = {captions?: TimedCaption[]};

// Shared scene chrome: background, optional on-screen headline, burned-in caption.
export const SceneFrame: React.FC<{
  children: React.ReactNode;
  headline?: string;
  captions?: TimedCaption[];
  background?: string;
}> = ({children, headline, captions = [], background = theme.tint}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  // Hold each caption until the next one starts so there's no flicker between chunks.
  const caption = captions.find((c, i) => t >= c.start && t < (captions[i + 1]?.start ?? c.end + 0.8));
  const headlineIn = interpolate(frame, [10, 28], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background, fontFamily: theme.fontBody, color: theme.navy}}>
      {children}
      {headline && (
        <div
          style={{
            position: 'absolute',
            top: 72,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: theme.fontDisplay,
            fontWeight: 700,
            fontSize: 50,
            padding: '0 40px',
            color: theme.navy,
            opacity: headlineIn,
            transform: `translateY(${(1 - headlineIn) * 16}px)`,
          }}
        >
          {headline}
        </div>
      )}
      {caption && <Caption text={caption.text} />}
    </AbsoluteFill>
  );
};

export const Caption: React.FC<{text: string}> = ({text}) => (
  <div
    style={{
      position: 'absolute',
      bottom: 56,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        maxWidth: 1400,
        background: 'rgba(10,35,55,0.86)',
        color: theme.white,
        fontFamily: theme.fontBody,
        fontWeight: 500,
        fontSize: 38,
        lineHeight: 1.35,
        padding: '14px 28px',
        borderRadius: 12,
        textAlign: 'center',
      }}
    >
      {text}
    </div>
  </div>
);
