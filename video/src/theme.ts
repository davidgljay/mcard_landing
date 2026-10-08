import {loadFont as loadDisplay} from '@remotion/google-fonts/PlaypenSans';
import {loadFont as loadBody} from '@remotion/google-fonts/Inter';

const display = loadDisplay('normal', {weights: ['500', '700', '800'], subsets: ['latin']});
const body = loadBody('normal', {weights: ['400', '500', '600', '700'], subsets: ['latin']});

// Tokens mirror mcard_landing/css/main.css; coral is the brand accent from
// card_protocol/branding/color_palette.md, used only for "show your card" moments.
export const theme = {
  fontDisplay: display.fontFamily,
  fontBody: body.fontFamily,
  navy: '#0a2337',
  green800: '#1c330f',
  green600: '#3f7a13',
  green500: '#63ae22',
  green200: '#aed38e',
  green100: '#d8ecc8',
  tint: '#f7f6f0',
  tint2: '#f4f9ef',
  border: '#e7e4da',
  bodyText: '#33424a',
  muted: '#5c6b71',
  coral: '#ff6260',
  coral200: '#ffcbc4',
  white: '#ffffff',
};

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
