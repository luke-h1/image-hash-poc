import { Sharp } from 'sharp';

export const resizeImage = async (sharpImage: Sharp): Promise<Sharp> => {
  const metadata = await sharpImage.metadata();

  // Calculate the maximum dimensions
  const maxWidth = 16383;
  const maxHeight = 16383;

  if (!metadata.width) {
    throw new Error('No metadata width found for image');
  }

  if (!metadata.height) {
    throw new Error('No metadata height found for image');
  }

  // Determine whether resizing is necessary
  const needsResize = metadata.width > maxWidth || metadata.height > maxHeight;

  let resizedImage = sharpImage;

  if (needsResize) {
    // Calculate the new size maintaining the aspect ratio
    const aspectRatio = metadata.width / metadata.height;
    let newWidth = maxWidth;
    let newHeight = maxHeight;

    if (metadata.width > metadata.height) {
      // Landscape or square image: scale by width
      newHeight = Math.round(newWidth / aspectRatio);
    } else {
      // Portrait image: scale by height
      newWidth = Math.round(newHeight * aspectRatio);
    }

    // Resize the image before converting to WebP
    resizedImage = sharpImage.resize(newWidth, newHeight);
  }

  return resizedImage;
};
