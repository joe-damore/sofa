import { Command } from 'commander';

import backendMap from './builder/backends/backend-map';
import BuildFileFinder from './project/build-file-finder';
import ProjectLoader from './project/project-loader';
import ProjectSummary from './project/project-summary';

import BuildReporter from './builder/build-reporter';
import BasicFormatter from './builder/formatters/basic-formatter';

const name = process.env.npm_package_name || 'sofa-build';
const version = process.env.npm_package_version || '0.0.0';
const program = new Command();

program
  .version(version)
  .option('-p, --path <project dir>', 'project directory path', process.cwd())
  .option('-m, --mode <build mode>', 'build mode', 'development')
  .option('-c, --clean', 'clean output directories');

program.parse(process.argv);

console.log(name);
console.log(`v${version}\n`);

const buildFileFinder = new BuildFileFinder(program.opts().path);
const buildFilePath = buildFileFinder.findBuildFile();

try {
  if (!buildFilePath) {
    throw new Error('Build file does not exist in project directory.');
  }

  const project = ProjectLoader.loadFromFileSync(buildFilePath);
  const summary = new ProjectSummary(project);

  summary.display();

  const BackendClass = backendMap[project.build.backend];
  if (!BackendClass) {
    throw new Error(`Unknown build backend '${project.build.backend}'.`)
  }

  const backend = new BackendClass(project);
  const main = async () => {
    if (program.opts().clean) {
      await backend.clean();
    }

    const buildResults = await backend.build();
    const resultsFormatter = new BasicFormatter();
    const resultsReporter = new BuildReporter(buildResults, resultsFormatter);

    resultsReporter.display();
  };

  main();
}
catch (e) {
  const error = (e as Error);
  if (error.message) {
    console.error(error.message);
  }
  else {
    console.error('An unknown error has occurred.');
  }
  process.exit(1);
}
