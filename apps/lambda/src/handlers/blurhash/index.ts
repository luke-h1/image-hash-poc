import {
  APIGatewayProxyEventBase,
  APIGatewayEventDefaultAuthorizerContext,
} from 'aws-lambda';

const blurHashHandler = async (
  body: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>['body'],
): Promise<string> => {
  // eslint-disable next-line
  console.log('body ->', body);

  return JSON.stringify({});
};
export default blurHashHandler;
