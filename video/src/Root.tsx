import React from 'react';
import {Audio, Composition, Sequence, Series, staticFile} from 'remotion';
import {FPS, HEIGHT, WIDTH} from './theme';
import {scenes, type SceneMeta} from './script';
import type {SceneProps} from './components/Frame';
import {Scene1} from './scenes/Scene1';
import {Scene2} from './scenes/Scene2';
import {Scene3} from './scenes/Scene3';
import {Scene4} from './scenes/Scene4';
import {Scene5} from './scenes/Scene5';
import {Scene6} from './scenes/Scene6';
import {Scene7} from './scenes/Scene7';

const components: Record<string, React.FC<SceneProps>> = {Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7};

const frames = (s: SceneMeta) => Math.round(s.seconds * FPS);

// One scene with its voiceover.
const SceneWithVo: React.FC<{scene: SceneMeta}> = ({scene}) => {
  const C = components[scene.id];
  return (
    <>
      <C captions={scene.captions} />
      <Sequence from={Math.round(scene.leadIn * FPS)}>
        <Audio src={staticFile(scene.audio)} />
      </Sequence>
    </>
  );
};

const Full: React.FC = () => (
  <Series>
    {scenes.map((s) => (
      <Series.Sequence key={s.id} durationInFrames={frames(s)}>
        <SceneWithVo scene={s} />
      </Series.Sequence>
    ))}
  </Series>
);

export const Root: React.FC = () => (
  <>
    <Composition
      id="Explainer"
      component={Full}
      durationInFrames={scenes.reduce((n, s) => n + frames(s), 0)}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    {scenes.map((s) => (
      <Composition
        key={s.id}
        id={s.id}
        component={SceneWithVo}
        durationInFrames={frames(s)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{scene: s}}
      />
    ))}
  </>
);
