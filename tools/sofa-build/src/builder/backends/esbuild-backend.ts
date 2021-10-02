import Backend from './backend';
import BuildResults from '../build-results';

class ESBuildBackend extends Backend {

  public getName(): string {
    return 'ESBuild';
  }

  public async build(): Promise<BuildResults> {
    return new BuildResults([], []);
  }

}

export default ESBuildBackend;
