import { encode } from 'blurhash';
import sharp from 'sharp';

export const createHash = async (imageArray: Uint8Array) => {
  const sharpImage = sharp(imageArray);

  const { data, info } = await sharpImage.ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });

  const encoded = encode(
    new Uint8ClampedArray(data),
    info.width,
    info.height,
    4,
    4,
  );

  return {
    hash: encoded,
    height: info.height,
    width: info.width,
  };
};
