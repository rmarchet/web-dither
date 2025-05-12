import { applyAtkinson } from './atkinson';
export const atkinson = {
  apply: applyAtkinson,
  name: 'Atkinson',
  handle: 'atkinson',
  description: 'A dithering algorithm that uses a 3x3 grid to distribute error',
  category: 'Error Diffusion',
};
