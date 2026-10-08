import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SceneFrame, type SceneProps} from '../components/Frame';
import {Card} from '../components/Card';
import {communityCards, nurseCard} from '../cards';
import {enter, fade} from '../anim';
import {theme} from '../theme';

const Avatar: React.FC<{initial: string; color: string}> = ({initial, color}) => (
  <div
    style={{
      width: 64,
      height: 64,
      borderRadius: 32,
      background: color,
      color: theme.white,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: theme.fontDisplay,
      fontWeight: 700,
      fontSize: 30,
      flexShrink: 0,
    }}
  >
    {initial}
  </div>
);

const Message: React.FC<{who: string; initial: string; color: string; t: number; children: React.ReactNode}> = ({
  who,
  initial,
  color,
  t,
  children,
}) => (
  <div style={{display: 'flex', gap: 18, opacity: t, transform: `translateY(${(1 - t) * 24}px)`}}>
    <Avatar initial={initial} color={color} />
    <div>
      <div style={{fontFamily: theme.fontBody, fontWeight: 700, fontSize: 24, color: theme.navy, marginBottom: 6}}>{who}</div>
      <div
        style={{
          background: theme.white,
          border: `2px solid ${theme.border}`,
          borderRadius: '6px 22px 22px 22px',
          padding: '18px 24px',
          fontFamily: theme.fontBody,
          fontSize: 30,
          lineHeight: 1.4,
          color: theme.navy,
          maxWidth: 760,
        }}
      >
        {children}
      </div>
    </div>
  </div>
);

const VerifiedChip: React.FC<{t: number}> = ({t}) => (
  <div
    style={{
      marginTop: 16,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      background: theme.green100,
      border: `2px solid ${theme.green500}`,
      color: theme.green800,
      borderRadius: 999,
      padding: '8px 20px 8px 10px',
      fontFamily: theme.fontBody,
      fontWeight: 700,
      fontSize: 26,
      opacity: t,
      transform: `scale(${0.9 + t * 0.1})`,
      transformOrigin: 'left center',
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 18,
        background: theme.green600,
        color: theme.white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
      }}
    >
      ✓
    </div>
    Registered Nurse · Card Verified
  </div>
);

export const Scene4: React.FC<SceneProps> = ({captions}) => {
  const frame = useCurrentFrame();
  const q = enter(frame, 65);
  const reply = enter(frame, 152);
  const attach = enter(frame, 185, 24);
  const chip = fade(frame, 215, 230);
  const right = fade(frame, 279, 299);
  return (
    <SceneFrame captions={captions}>
      <div
        style={{
          position: 'absolute',
          left: 110,
          top: 90,
          width: 1060,
          bottom: 200,
          background: theme.tint2,
          border: `3px solid ${theme.border}`,
          borderRadius: 32,
          padding: '34px 44px',
          display: 'flex',
          flexDirection: 'column',
          gap: 36,
        }}
      >
        <div style={{fontFamily: theme.fontDisplay, fontWeight: 700, fontSize: 36, color: theme.green800}}>
          Waterfront Salsa Society · group chat
        </div>
        <Message who="Marisol" initial="M" color="#b5651d" t={q}>
          Twisted my ankle at practice last night. Ice or heat?
        </Message>
        <Message who="Andre" initial="A" color={theme.green600} t={reply}>
          Ice for the first two days, and keep it raised. Happy to take a look Thursday.
          <div
            style={{
              marginTop: 18,
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              opacity: attach,
              transform: `translateY(${(1 - attach) * 30}px)`,
            }}
          >
            <Card card={nurseCard} width={250} />
          </div>
          <VerifiedChip t={chip} />
        </Message>
      </div>
      <div style={{position: 'absolute', left: 1260, top: 150, width: 560, opacity: right}}>
        <div style={{fontFamily: theme.fontDisplay, fontWeight: 700, fontSize: 40, color: theme.navy, marginBottom: 28}}>
          Cards stay current
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 44, alignItems: 'flex-start'}}>
          <div>
            <Card card={communityCards.salsa} width={400} />
            <div
              style={{
                marginTop: 14,
                fontFamily: theme.fontBody,
                fontWeight: 600,
                fontSize: 26,
                color: theme.green600,
              }}
            >
              + Updated: Volunteer instructor
            </div>
          </div>
          <div>
            <Card card={communityCards.salsa} width={400} revoked />
            <div style={{marginTop: 14, fontFamily: theme.fontBody, fontWeight: 600, fontSize: 26, color: theme.muted}}>
              Revoked: no longer in good standing
            </div>
          </div>
        </div>
      </div>
    </SceneFrame>
  );
};
