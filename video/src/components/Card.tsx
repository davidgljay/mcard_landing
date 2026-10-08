import React from 'react';
import {Img, staticFile} from 'remotion';
import {theme} from '../theme';
import type {CardSpec} from '../cards';

export const CARD_RATIO = 1.586;

type Props = {
  card: CardSpec;
  width: number;
  revoked?: boolean;
  style?: React.CSSProperties;
};

export const Card: React.FC<Props> = ({card, width, revoked, style}) => {
  const height = width / CARD_RATIO;
  const band = height * 0.34;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: width * 0.055,
        overflow: 'hidden',
        background: card.color ?? theme.green800,
        boxShadow: '0 18px 40px rgba(10,35,55,0.22), 0 2px 6px rgba(10,35,55,0.12)',
        border: `${Math.max(3, width * 0.012)}px solid ${theme.white}`,
        position: 'relative',
        filter: revoked ? 'grayscale(1) opacity(0.55)' : undefined,
        ...style,
      }}
    >
      {card.image ? (
        <Img
          src={staticFile(card.image)}
          style={{position: 'absolute', inset: 0, width: '100%', height: height - band, objectFit: 'cover'}}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            height: height - band,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.white,
            opacity: 0.9,
          }}
        >
          <svg width={height * 0.36} height={height * 0.36} viewBox="0 0 24 24" fill="none">
            <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
          </svg>
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: band,
          background: card.color ?? theme.green800,
          padding: `0 ${width * 0.06}px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: theme.fontBody,
            fontSize: width * 0.036,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: theme.green200,
            fontWeight: 600,
          }}
        >
          {card.label ?? 'Member'}
        </div>
        <div
          style={{
            fontFamily: theme.fontDisplay,
            fontSize: width * 0.066,
            fontWeight: 700,
            color: theme.white,
            lineHeight: 1.15,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {card.name}
        </div>
      </div>
      {revoked && (
        <div
          style={{
            position: 'absolute',
            top: '38%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-12deg)',
            border: `${width * 0.014}px solid ${theme.coral}`,
            color: theme.coral,
            fontFamily: theme.fontDisplay,
            fontWeight: 800,
            fontSize: width * 0.1,
            padding: `${width * 0.01}px ${width * 0.04}px`,
            borderRadius: width * 0.02,
            background: 'rgba(255,255,255,0.9)',
            letterSpacing: '0.08em',
          }}
        >
          REVOKED
        </div>
      )}
    </div>
  );
};
