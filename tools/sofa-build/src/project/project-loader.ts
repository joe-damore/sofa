import YAML from 'yaml';
import fs from 'fs';
import path from 'path';
import validate from '../schema/validate';
import { BuildFile } from '../schema/schema';
import Project from './project';
import App from './app';
import Library from './library';
import Build from './build';

/**
 * Loads Projects from the filesystem.
 */
class ProjectLoader {

  /**
   * Returns a project from build file data and a path.
   *
   * @param {BuildFile} data - Build file data.
   * @param {string} path - Project path.
   *
   * @return {Project} Loaded project.
   */
  static loadFromBuildFileData(data: BuildFile, path: string): Project {
    const build = new Build(path);

    if (data.build) {
      build.backend = (data.build.backend ? data.build.backend : build.backend);
      build.srcPath = (data.build.src ? data.build.src : build.srcPath);
      build.distPath = (data.build.dist ? data.build.dist : build.distPath);
      build.umdDistPath = (data.build.umdDist ? data.build.umdDist : build.umdDistPath);
      build.typesPath = (data.build.types ? data.build.types : build.typesPath);
    }

    const project = new Project(data.meta.name, path, build);

    if (data.app) {
      project.app = new App(data.app.friendlyName, path, build);
    }
    else if (data.lib) {
      project.lib = new Library(data.lib.objectName, path, build);
    }

    return project;
  }

  /**
   * Returns a project from a build file at a given path.
   *
   * @param {string} filepath - Path to project build file.
   *
   * @return {Project} Loaded project.
   */
  static loadFromFileSync(filepath: string): Project {
    const stringData = fs.readFileSync(filepath, 'utf8');
    const objectData: BuildFile = YAML.parse(stringData);

    const errors = validate(objectData);
    if (errors !== null) {
      // Validation error.
      // TODO Handle validation error more gracefully.
      errors.forEach((error) => {
        console.error(error.message);
      });
    }

    const projectDir = path.dirname(filepath);
    return ProjectLoader.loadFromBuildFileData(objectData, projectDir);
  }
}

export default ProjectLoader;
