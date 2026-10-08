import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {SceneFrame, type SceneProps} from '../components/Frame';
import {Card} from '../components/Card';
import {Phone} from '../components/Phone';
import {communityCards} from '../cards';
import {enter, fade, lerp} from '../anim';
import {theme} from '../theme';

const Resource: React.FC<{icon: string; label: string; t: number}> = ({icon, label, t}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 22,
      background: theme.white,
      border: `3px solid ${theme.border}`,
      borderRadius: 24,
      padding: '18px 30px 18px 22px',
      opacity: t,
      transform: `translateY(${(1 - t) * 30}px)`,
      boxShadow: '0 8px 24px rgba(10,35,55,0.08)',
    }}
  >
    <Img src={staticFile(icon)} style={{height: 70}} />
    <div style={{fontFamily: theme.fontDisplay, fontWeight: 700, fontSize: 38, color: theme.navy}}>{label}</div>
  </div>
);

// "Members only" door that swings open when the card arrives.
const Door: React.FC<{open: number}> = ({open}) => (
  <div style={{position: 'relative', width: 340, height: 500}}>
    <div
      style={{
        position: 'absolute',
        inset: -90,
        borderRadius: 80,
        background: `radial-gradient(closest-side, ${theme.coral200}, transparent)`,
        opacity: open,
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: theme.green100,
        border: `8px solid ${theme.green800}`,
        borderRadius: '24px 24px 6px 6px',
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 8,
        background: theme.green600,
        borderRadius: '16px 16px 2px 2px',
        transformOrigin: '0% 50%',
        transform: `perspective(900px) rotateY(${-58 * open}deg)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 70,
      }}
    >
      <div
        style={{
          background: theme.white,
          color: theme.green800,
          fontFamily: theme.fontDisplay,
          fontWeight: 800,
          fontSize: 30,
          padding: '10px 22px',
          borderRadius: 10,
        }}
      >
        MEMBERS ONLY
      </div>
      <div style={{position: 'absolute', right: 30, top: 250, width: 22, height: 22, borderRadius: 11, background: theme.green200}} />
    </div>
  </div>
);

const ChatStrip: React.FC<{t: number}> = ({t}) => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 12, opacity: t}}>
    <div style={{fontFamily: theme.fontBody, fontWeight: 600, fontSize: 24, color: theme.muted}}>Salsa crew · group chat</div>
    {['Who’s coming Thursday?', 'Me! I’ll bring the speaker.'].map((m, i) => (
      <div
        key={m}
        style={{
          alignSelf: i ? 'flex-end' : 'flex-start',
          background: i ? '#dcf8c6' : theme.white,
          border: `2px solid ${theme.border}`,
          borderRadius: 18,
          padding: '12px 20px',
          fontSize: 28,
          fontFamily: theme.fontBody,
          color: theme.navy,
        }}
      >
        {m}
      </div>
    ))}
  </div>
);

export const Scene3: React.FC<SceneProps> = ({captions}) => {
  const frame = useCurrentFrame();
  // Drag the card out of the wallet and onto the door on "show their card".
  const drag = enter(frame, 292, 60);
  const open = fade(frame, 340, 370);
  const cardX = lerp(drag, 189, 1230);
  const cardY = lerp(drag, 520, 560);
  return (
    <SceneFrame headline="Anything your community makes can check for a card." captions={captions}>
      <Phone width={300} style={{position: 'absolute', left: 170, top: 250}} screen={theme.tint2}>
        <div style={{padding: '70px 20px 0', fontFamily: theme.fontBody, fontSize: 20, color: theme.muted, fontWeight: 600}}>
          Card wallet
        </div>
        <div style={{position: 'absolute', top: 260, left: 18, opacity: 0.35}}>
          <div style={{width: 236, height: 149, borderRadius: 14, border: `2px dashed ${theme.muted}`}} />
        </div>
      </Phone>
      <div style={{position: 'absolute', left: 620, top: 240, display: 'flex', flexDirection: 'column', gap: 20}}>
        <Resource icon="icon-car.png" label="Rideshare list" t={enter(frame, 159)} />
        <Resource icon="icon-calendar.png" label="Community calendar" t={enter(frame, 205)} />
        <Resource icon="icon-clothes.png" label="Free-stuff board" t={enter(frame, 253)} />
      </div>
      <div style={{position: 'absolute', left: 1440, top: 290}}>
        <Door open={open} />
      </div>
      <div style={{position: 'absolute', left: 660, top: 650, width: 520}}>
        <ChatStrip t={fade(frame, 363, 385)} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: cardX,
          top: cardY,
          transform: `rotate(${lerp(drag, 0, -8)}deg) scale(${lerp(drag, 1, 0.9)})`,
          zIndex: 10,
        }}
      >
        <Card card={communityCards.salsa} width={236} />
        {drag > 0.05 && drag < 0.98 && (
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            style={{position: 'absolute', right: -26, bottom: -30}}
          >
            <path d="M5 3l14 8-6 1.5L9.5 19z" fill={theme.white} stroke={theme.navy} strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </SceneFrame>
  );
};
