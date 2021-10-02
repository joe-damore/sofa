import ESBuildBackend from './esbuild-backend';
import WebpackBackend from './webpack-backend';

const backendMap = {
  'webpack': WebpackBackend,
  'esbuild': ESBuildBackend,
};

export default backendMap;
