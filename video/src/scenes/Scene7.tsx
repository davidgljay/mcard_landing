import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {SceneFrame, type SceneProps} from '../components/Frame';
import {Card} from '../components/Card';
import {communityCards} from '../cards';
import {enter, fade} from '../anim';
import {theme} from '../theme';

const fan = [
  {card: communityCards.salsa, rot: -18},
  {card: communityCards.youth, rot: -9},
  {card: communityCards.mutualAid, rot: 0},
  {card: communityCards.choir, rot: 9},
  {card: communityCards.climate, rot: 18},
];

export const Scene7: React.FC<SceneProps> = ({captions}) => {
  const frame = useCurrentFrame();
  const spread = enter(frame, 0, 30);
  const text = fade(frame, 60, 90);
  return (
    <SceneFrame captions={captions} background={theme.green800}>
      <div style={{position: 'absolute', left: 960, top: 520}}>
        {fan.map((f, i) => (
          <div
            key={f.card.id}
            style={{
              position: 'absolute',
              left: -180,
              top: -280,
              transformOrigin: '50% 180%',
              transform: `rotate(${f.rot * spread}deg)`,
              zIndex: i,
            }}
          >
            <Card card={f.card} width={360} />
          </div>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 600,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: text,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
          <Img src={staticFile('logo-transparent-white.png')} style={{width: 92}} />
          <div style={{fontFamily: theme.fontDisplay, fontWeight: 700, fontSize: 54, color: theme.white}}>
            Membership Card Protocol
          </div>
        </div>
        <div style={{marginTop: 18, fontFamily: theme.fontDisplay, fontWeight: 800, fontSize: 72, color: theme.green200}}>
          membershipcard.io
        </div>
        <div style={{marginTop: 18, fontFamily: theme.fontBody, fontSize: 28, color: theme.green100}}>
          A project of Relationality Lab
        </div>
      </div>
    </SceneFrame>
  );
};
