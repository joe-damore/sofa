import Backend from './backend';
import Project from '../../project/project';
import ESBuildBackend from './esbuild-backend';
import WebpackBackend from './webpack-backend';

interface BackendMap {
  [backendName: string]: new (project: Project) => Backend;
}

const backendMap: BackendMap = {
  'webpack': WebpackBackend,
  'esbuild': ESBuildBackend,
};

export default backendMap;
