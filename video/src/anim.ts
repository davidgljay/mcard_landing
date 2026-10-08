import {interpolate, spring} from 'remotion';
import {FPS} from './theme';

// 0 → 1 entrance starting at `start` frames.
export const enter = (frame: number, start: number, durationInFrames = 18) =>
  spring({frame: frame - start, fps: FPS, durationInFrames, config: {damping: 200}});

export const fade = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

export const lerp = (t: number, a: number, b: number) => a + (b - a) * t;
