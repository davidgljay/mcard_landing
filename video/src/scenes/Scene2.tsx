import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SceneFrame, type SceneProps} from '../components/Frame';
import {Card} from '../components/Card';
import {Phone} from '../components/Phone';
import {communityCards} from '../cards';
import {enter, fade} from '../anim';
import {theme} from '../theme';

const Struck: React.FC<{label: string; t: number}> = ({label, t}) => (
  <div
    style={{
      position: 'relative',
      fontFamily: theme.fontDisplay,
      fontWeight: 700,
      fontSize: 40,
      color: theme.muted,
      padding: '10px 26px',
      border: `3px solid ${theme.border}`,
      borderRadius: 999,
      background: theme.white,
      opacity: 1 - t * 0.45,
    }}
  >
    {label}
    <div
      style={{
        position: 'absolute',
        left: 14,
        top: '52%',
        height: 6,
        width: `calc(${t * 100}% - 28px)`,
        background: theme.coral,
        borderRadius: 3,
      }}
    />
  </div>
);

export const Scene2: React.FC<SceneProps> = ({captions}) => {
  const frame = useCurrentFrame();
  const phones = [0, 1, 2].map((i) => enter(frame, 225 + i * 10));
  const link = fade(frame, 158, 175);
  return (
    <SceneFrame captions={captions}>
      <div style={{position: 'absolute', left: 120, top: 90}}>
        <div style={{fontFamily: theme.fontDisplay, fontWeight: 700, fontSize: 60, color: theme.navy}}>Desiree</div>
        <div style={{fontFamily: theme.fontBody, fontSize: 32, color: theme.muted, marginTop: 4}}>
          runs the Waterfront Salsa Society
        </div>
      </div>
      <div style={{position: 'absolute', left: 90, top: 290, opacity: fade(frame, 20, 40)}}>
        <Card card={communityCards.salsa} width={460} style={{transform: 'rotate(-4deg)'}} />
        <div
          style={{
            marginTop: 50,
            marginLeft: 40,
            opacity: link,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            background: theme.green100,
            color: theme.green800,
            fontFamily: theme.fontBody,
            fontWeight: 600,
            fontSize: 30,
            padding: '14px 26px',
            borderRadius: 999,
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1" />
            <path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />
          </svg>
          Share a link to claim the card
        </div>
      </div>
      <div style={{position: 'absolute', left: 660, top: 250, display: 'flex', gap: 30}}>
        {phones.map((t, i) => (
          <Phone key={i} width={230} style={{opacity: t, transform: `translateY(${(1 - t) * 60 + (i === 1 ? -30 : 0)}px)`}} screen={theme.tint2}>
            <div style={{padding: '60px 14px 0', fontFamily: theme.fontBody, fontSize: 16, color: theme.muted, fontWeight: 600}}>
              Card wallet
            </div>
            <div style={{position: 'absolute', top: 100, left: 14}}>
              <Card card={communityCards.salsa} width={180} />
            </div>
            <div style={{position: 'absolute', top: 240, left: 14, opacity: 0.35}}>
              <div style={{width: 180, height: 113, borderRadius: 11, border: `2px dashed ${theme.muted}`}} />
            </div>
          </Phone>
        ))}
      </div>
      <div style={{position: 'absolute', left: 1440, top: 330, display: 'flex', flexDirection: 'column', gap: 36, alignItems: 'flex-start'}}>
        {['Accounts', 'Passwords', 'Spreadsheets'].map((l, i) => (
          <Struck key={l} label={l} t={fade(frame, [316, 339, 365][i], [316, 339, 365][i] + 15)} />
        ))}
      </div>
    </SceneFrame>
  );
};
