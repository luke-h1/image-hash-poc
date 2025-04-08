import blurHashHandler from '@lambda/handlers/blurhash';
import healthHandler from '@lambda/handlers/health';
import versionHandler from '@lambda/handlers/version';
import {
  APIGatewayEventDefaultAuthorizerContext,
  APIGatewayProxyEventBase,
  APIGatewayProxyEventQueryStringParameters,
} from 'aws-lambda';

export type RoutePath = '/api/health' | '/api/version' | '/api/blurhash';

const routes = async (
  path: RoutePath,
  body: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>['body'],
  queryStringParameters: APIGatewayProxyEventQueryStringParameters | null,
) => {
  let response: unknown;

  switch (path) {
    /**
     * @see terraform/gateway.tf for a list of valid routes
     */
    case '/api/health':
      response = await healthHandler();
      break;

    case '/api/version':
      response = await versionHandler();
      break;

    case '/api/blurhash':
      response = await blurHashHandler(body, queryStringParameters);
      break;

    default:
      response = JSON.stringify({ message: 'route not found' }, null, 2);
      break;
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,POST,PUT,DELETE',
    },
    body: response,
  };
};
export default routes;
