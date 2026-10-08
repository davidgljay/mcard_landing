import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SceneFrame, type SceneProps} from '../components/Frame';
import {Card} from '../components/Card';
import {communityCards} from '../cards';
import {enter, fade} from '../anim';
import {theme} from '../theme';

// Outline drawing of a traditional card (library card, union card).
const LineCard: React.FC<{title: string; lines: string[]; opacity: number; x: number; y: number; rot: number}> = ({
  title,
  lines,
  opacity,
  x,
  y,
  rot,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 380,
      height: 240,
      border: `5px solid ${theme.green800}`,
      borderRadius: 22,
      background: theme.white,
      padding: '26px 30px',
      transform: `rotate(${rot}deg)`,
      opacity,
    }}
  >
    <div style={{fontFamily: theme.fontDisplay, fontWeight: 700, fontSize: 34, color: theme.green800}}>{title}</div>
    <div style={{marginTop: 22, display: 'flex', flexDirection: 'column', gap: 14}}>
      {lines.map((l) => (
        <div key={l} style={{display: 'flex', gap: 14, alignItems: 'center'}}>
          <div style={{fontFamily: theme.fontBody, fontSize: 20, color: theme.muted, width: 90}}>{l}</div>
          <div style={{flex: 1, height: 3, background: theme.border}} />
        </div>
      ))}
    </div>
  </div>
);

const fan = [
  {card: communityCards.salsa, x: 0, y: 60, rot: -8},
  {card: communityCards.youth, x: 170, y: 20, rot: -4},
  {card: communityCards.mutualAid, x: 340, y: 0, rot: 0},
  {card: communityCards.choir, x: 510, y: 20, rot: 4},
  {card: communityCards.climate, x: 680, y: 60, rot: 8},
];

export const Scene1: React.FC<SceneProps> = ({captions}) => {
  const frame = useCurrentFrame();
  const lib = fade(frame, 0, 15);
  const union = fade(frame, 60, 75);
  const fanIn = (i: number) => enter(frame, 90 + i * 8);
  return (
    <SceneFrame headline="A card says: you belong here." captions={captions}>
      <LineCard title="Public Library" lines={['Name', 'Card no.']} opacity={lib} x={170} y={330} rot={-5} />
      <LineCard title="Union Local 12" lines={['Member', 'Since']} opacity={union} x={250} y={560} rot={4} />
      <div style={{position: 'absolute', left: 720, top: 500, fontSize: 80, color: theme.green500, opacity: fanIn(0)}}>→</div>
      <div style={{position: 'absolute', left: 830, top: 400}}>
        {fan.map((f, i) => {
          const t = fanIn(i);
          return (
            <div
              key={f.card.id}
              style={{
                position: 'absolute',
                left: f.x,
                top: f.y + (1 - t) * 60,
                opacity: t,
                transform: `rotate(${f.rot * t}deg)`,
                transformOrigin: '50% 120%',
              }}
            >
              <Card card={f.card} width={360} />
            </div>
          );
        })}
      </div>
    </SceneFrame>
  );
};
