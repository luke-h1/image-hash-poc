import { LambdaActions } from './lambdaError';

const buildPath = (path: string): LambdaActions | string => {
  switch (path) {
    case 'blurhash':
    case '/api/blurhash':
      return 'blurhash';

    case 'health':
    case '/api/health':
      return 'health';

    case 'version':
    case '/api/version':
      return 'version';

    default:
      return 'unknown';
  }
};
export default buildPath;
