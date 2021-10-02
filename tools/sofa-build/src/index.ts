import ProjectLoader from './project/project-loader';
import WebpackBackend from './builder/backends/webpack-backend';

import BuildReporter from './builder/build-reporter';
import BasicFormatter from './builder/formatters/basic-formatter';

const proj = ProjectLoader.loadFromFileSync('../../core/sofa-core/.sofa-build.yml');

const be = new WebpackBackend(proj);

const main = async () => {
  await be.clean();
  const res = await be.build();

  const formatter = new BasicFormatter();
  const reporter = new BuildReporter(res, formatter);
  reporter.display();
};

main();
