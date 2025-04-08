import axios from 'axios';
import { encode } from 'blurhash';
import sharp from 'sharp';

export const createHash = async (imageUrl: string) => {
  // Fetch the image data from the URL
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  const imageArray = new Uint8Array(response.data);

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
