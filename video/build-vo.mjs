// Scratch voiceover: reads the approved script, synthesizes each scene with
// macOS `say`, and writes per-scene timings + caption chunks to src/vo.json.
// Swap public/vo/*.wav for real recordings later and re-run with --measure-only.
import {execFileSync} from 'node:child_process';
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';

const SCRIPT = '../../card_protocol/plans/explainer-video-script.md';
const VOICE = process.env.VO_VOICE ?? 'Samantha';
const RATE = process.env.VO_RATE ?? '165';
const LEAD_IN = 0.4; // seconds of silence before VO in each scene
const TAIL = 0.8; // seconds held after VO ends
const measureOnly = process.argv.includes('--measure-only');

const md = readFileSync(SCRIPT, 'utf8');
const lines = [...md.matchAll(/\*\*Voiceover:\*\*\n(.+)/g)].map((m) => m[1].trim());
if (lines.length !== 7) throw new Error(`Expected 7 voiceover lines, found ${lines.length}`);

mkdirSync('public/vo', {recursive: true});

const probe = (f) =>
  Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim());

// Split into caption-sized chunks: sentences, then long sentences at commas.
const chunk = (text) => {
  const sentences = text.split(/(?<=[.?!])\s+/);
  return sentences.flatMap((s) => {
    if (s.length <= 70) return [s];
    let parts = s.split(/(?<=,)\s+/);
    // No commas to break on: split at the space nearest the middle.
    if (parts.length === 1) {
      const mid = s.lastIndexOf(' ', Math.floor(s.length / 2) + 6);
      parts = [s.slice(0, mid), s.slice(mid + 1)];
    }
    const out = [];
    let cur = '';
    for (const p of parts) {
      if (cur && (cur + ' ' + p).length > 70) {
        out.push(cur);
        cur = p;
      } else cur = cur ? cur + ' ' + p : p;
    }
    if (cur) out.push(cur);
    return out;
  });
};

const scenes = lines.map((text, i) => {
  const n = i + 1;
  const wav = `public/vo/scene${n}.wav`;
  if (!measureOnly) {
    const aiff = `public/vo/scene${n}.aiff`;
    // Spell the URL out so TTS doesn't mangle it.
    const spoken = text.replace('membershipcard.io', 'membership card dot I O');
    execFileSync('say', ['-v', VOICE, '-r', RATE, '-o', aiff, spoken]);
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', aiff, '-ar', '48000', '-ac', '1', wav]);
    execFileSync('rm', [aiff]);
  }
  const voSeconds = probe(wav);
  // Caption timing is proportional to character count — good enough for scratch.
  const chunks = chunk(text);
  const total = chunks.reduce((a, c) => a + c.length, 0);
  let t = LEAD_IN;
  const captions = chunks.map((c) => {
    const d = (c.length / total) * voSeconds;
    const cap = {text: c, start: +t.toFixed(2), end: +(t + d).toFixed(2)};
    t += d;
    return cap;
  });
  return {id: `Scene${n}`, audio: `vo/scene${n}.wav`, leadIn: LEAD_IN, voSeconds: +voSeconds.toFixed(2), seconds: +(LEAD_IN + voSeconds + TAIL).toFixed(2), captions};
});

writeFileSync('src/vo.json', JSON.stringify({voice: VOICE, rate: RATE, scenes}, null, 2) + '\n');
const total = scenes.reduce((a, s) => a + s.seconds, 0);
for (const s of scenes) console.log(`${s.id}: ${s.seconds.toFixed(1)}s (${s.captions.length} captions)`);
console.log(`Total: ${Math.floor(total / 60)}:${String(Math.round(total % 60)).padStart(2, '0')}`);
