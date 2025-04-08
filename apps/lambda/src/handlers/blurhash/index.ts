import {
  APIGatewayProxyEventBase,
  APIGatewayEventDefaultAuthorizerContext,
} from 'aws-lambda';
import axios from 'axios';
import { encode } from 'blurhash';
import { Jimp } from 'jimp';

const blurHashHandler = async (
  body: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>['body'],
): Promise<string> => {
  try {
    // Parse the body to extract the URL
    const parsedBody = JSON.parse(body || '{}');
    const imageUrl = parsedBody.url;

    if (!imageUrl) {
      throw new Error('Image URL is required in the body');
    }

    // Fetch the image using axios
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data);

    // Use Jimp to process the image
    const image = await Jimp.read(imageBuffer);
    const { width, height, data } = image.bitmap;

    // Generate the BlurHash
    const blurHash = encode(new Uint8ClampedArray(data), width, height, 4, 4);

    return JSON.stringify({
      hash: blurHash,
      status: 'OK',
    });
  } catch (error) {
    console.error('Error generating BlurHash:', error);
    return JSON.stringify({
      error: 'unknown',
      status: 'FAILED',
    });
  }
};

export default blurHashHandler;
