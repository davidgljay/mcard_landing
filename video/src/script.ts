// Scene list + timings. Text and durations come from src/vo.json, which
// build-vo.mjs generates from card_protocol/plans/explainer-video-script.md.
import vo from './vo.json';
import type {TimedCaption} from './components/Frame';

export type SceneMeta = {
  id: string;
  seconds: number;
  audio: string;
  leadIn: number;
  captions: TimedCaption[];
  stillSecond: number; // moment used for the style frame
};

const stillSeconds: Record<string, number> = {Scene1: 8, Scene2: 12.5, Scene3: 13.2, Scene4: 12, Scene5: 12.5, Scene6: 13.5, Scene7: 8};

export const scenes: SceneMeta[] = vo.scenes.map((s) => ({...s, stillSecond: stillSeconds[s.id]}));
