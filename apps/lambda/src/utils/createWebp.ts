import sharp from 'sharp';
import { resizeImage } from './resizeImage';

export const createWebP = async (imageArray: Uint8Array) => {
  const sharpImage = sharp(imageArray);

  const resizedImage = await resizeImage(sharpImage);

  const webP = await resizedImage.webp().toBuffer();

  return webP;
};
