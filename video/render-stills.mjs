// Renders one style frame per scene into out/stills/, plus a contact sheet.
import {execFileSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';

const scenes = [
  ['Scene1', 8], ['Scene2', 12.5], ['Scene3', 13.2], ['Scene4', 12], ['Scene5', 12.5], ['Scene6', 13.5], ['Scene7', 8],
];
const FPS = 30;
mkdirSync('out/stills', {recursive: true});
for (const [id, sec] of scenes) {
  execFileSync('npx', ['remotion', 'still', 'src/index.ts', id, `out/stills/${id}.png`, `--frame=${Math.round(sec * FPS)}`], {stdio: 'inherit'});
}
