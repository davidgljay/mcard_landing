import React from 'react';
import {theme} from '../theme';

export const Phone: React.FC<{
  width: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  screen?: string;
}> = ({width, children, style, screen = theme.white}) => {
  const height = width * 2.05;
  const bezel = width * 0.045;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: width * 0.14,
        background: theme.navy,
        padding: bezel,
        boxShadow: '0 24px 60px rgba(10,35,55,0.25)',
        position: 'relative',
        ...style,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: width * 0.11,
          background: screen,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: width * 0.03,
            left: '50%',
            transform: 'translateX(-50%)',
            width: width * 0.28,
            height: width * 0.07,
            borderRadius: width * 0.04,
            background: theme.navy,
            zIndex: 5,
          }}
        />
        {children}
      </div>
    </div>
  );
};
