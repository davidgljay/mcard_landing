import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SceneFrame, type SceneProps} from '../components/Frame';
import {Card} from '../components/Card';
import {Phone} from '../components/Phone';
import {communityCards} from '../cards';
import {enter, fade} from '../anim';
import {theme} from '../theme';

const places = [
  {label: 'Choir rehearsal sign-up', card: communityCards.choir, y: 190},
  {label: 'Youth group chat', card: communityCards.youth, y: 450},
  {label: 'Food pantry schedule', card: communityCards.mutualAid, y: 710},
];

const PLACE_X = 1200;
const PLACE_W = 460;
const PLACE_H = 150;

export const Scene5: React.FC<SceneProps> = ({captions}) => {
  const frame = useCurrentFrame();
  const shown = places.map((_, i) => enter(frame, 123 + i * 27));
  // Dotted "linking" lines between places try to connect, then break.
  const tryLink = fade(frame, 209, 240);
  const breakLink = fade(frame, 260, 285);
  return (
    <SceneFrame headline="Proves one thing. Reveals nothing else." captions={captions}>
      <Phone width={300} style={{position: 'absolute', left: 150, top: 240}} screen={theme.tint2}>
        <div style={{padding: '64px 18px 0', fontFamily: theme.fontBody, fontSize: 18, color: theme.muted, fontWeight: 600}}>
          Card wallet
        </div>
        {places.map((p, i) => (
          <div key={p.card.id} style={{position: 'absolute', left: 18, top: 110 + i * 170}}>
            <Card card={p.card} width={236} />
          </div>
        ))}
      </Phone>

      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {places.map((p, i) => {
          const x1 = 440;
          const y1 = 240 + 14 + 110 + i * 170 + 74;
          const x2 = PLACE_X - 12;
          const y2 = p.y + PLACE_H / 2;
          return (
            <path
              key={p.label}
              d={`M ${x1} ${y1} C ${x1 + 300} ${y1}, ${x2 - 300} ${y2}, ${x2} ${y2}`}
              stroke={theme.green500}
              strokeWidth={5}
              strokeLinecap="round"
              fill="none"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - shown[i]}
            />
          );
        })}
        {[0, 1].map((i) => {
          const x = PLACE_X + PLACE_W + 40;
          const y1 = places[i].y + PLACE_H / 2 + 6;
          const y2 = places[i + 1].y + PLACE_H / 2 + 6;
          const mid = (y1 + y2) / 2;
          const gap = breakLink * 40;
          return (
            <g key={i} opacity={tryLink}>
              <path d={`M ${x} ${y1} Q ${x + 60} ${y1} ${x + 60} ${mid - gap}`} stroke={theme.coral} strokeWidth={5} strokeDasharray="4 14" strokeLinecap="round" fill="none" />
              <path d={`M ${x} ${y2} Q ${x + 60} ${y2} ${x + 60} ${mid + gap}`} stroke={theme.coral} strokeWidth={5} strokeDasharray="4 14" strokeLinecap="round" fill="none" />
              <g opacity={breakLink} transform={`translate(${x + 60} ${mid})`}>
                <circle r={26} fill={theme.white} stroke={theme.coral} strokeWidth={4} />
                <path d="M -10 -10 L 10 10 M 10 -10 L -10 10" stroke={theme.coral} strokeWidth={5} strokeLinecap="round" />
              </g>
            </g>
          );
        })}
      </svg>

      {places.map((p, i) => (
        <div
          key={p.label}
          style={{
            position: 'absolute',
            left: PLACE_X,
            top: p.y,
            width: PLACE_W,
            height: PLACE_H,
            opacity: shown[i],
            background: theme.white,
            border: `3px solid ${theme.border}`,
            borderRadius: 24,
            padding: '0 24px 0 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            boxShadow: '0 8px 24px rgba(10,35,55,0.08)',
          }}
        >
          <Card card={p.card} width={170} />
          <div style={{fontFamily: theme.fontDisplay, fontWeight: 700, fontSize: 30, color: theme.navy, lineHeight: 1.2}}>{p.label}</div>
        </div>
      ))}
    </SceneFrame>
  );
};
