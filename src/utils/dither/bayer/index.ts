import { applyBayer } from './bayer';

export const bayer = {
  apply: applyBayer,
  name: 'Bayer',
  description: 'A dithering algorithm that uses a Bayer matrix to distribute error',
  category: 'Error Diffusion',
  handle: 'bayer',
};
