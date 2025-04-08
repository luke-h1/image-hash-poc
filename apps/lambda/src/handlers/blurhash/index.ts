import {
  APIGatewayProxyEventBase,
  APIGatewayEventDefaultAuthorizerContext,
  APIGatewayProxyEventQueryStringParameters,
} from 'aws-lambda';
import axios from 'axios';
import { encode } from 'blurhash';
import { Jimp } from 'jimp';

const blurHashHandler = async (
  _body: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>['body'],
  qs: APIGatewayProxyEventQueryStringParameters,
): Promise<string> => {
  try {
    console.log('Query String Parameters >', qs);

    // Extract the image URL from the query string
    const imageUrl = qs?.url;

    if (!imageUrl) {
      throw new Error('Image URL is required in the query string');
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
      // @ts-expect-error null eeeeee
      error: error.message || 'unknown',
      status: 'FAILED',
    });
  }
};

export default blurHashHandler;
