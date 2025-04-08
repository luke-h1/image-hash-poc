import { createHash } from '@lambda/utils/createHash';
import {
  APIGatewayProxyEventBase,
  APIGatewayEventDefaultAuthorizerContext,
} from 'aws-lambda';

const blurHashHandler = async (
  body: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>['body'],
): Promise<string> => {
  // eslint-disable next-line
  console.log('body ->', body);

  // @ts-expect-error types wrong
  const hash = createHash(body.url);

  return JSON.stringify({
    hash,
    status: 'OK',
  });
};
export default blurHashHandler;
