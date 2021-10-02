import del from 'del';

import BuildResults from '../build-results';
import Project from '../../project/project';

/**
 * Abstract build backend.
 */
abstract class Backend {

  /**
   * Project for build backend.
   */
  public project: Project;

  /**
   * Constructor.
   *
   * @param {Project} project - Project for build backend.
   */
  constructor(project: Project) {
    this.project = project;
  }

  /**
   * Returns the name of this backend.
   *
   * @returns {string} Name of the backend.
   */
  public abstract getName(): string;

  /**
   * Performs the project build.
   *
   * @return {Promise} Promise that resolves to BuildResults instance.
   */
  public abstract build(): Promise<BuildResults>;

  /**
   * Deletes files within the project's dist and types paths.
   *
   * @return {Promise} Project clean promise.
   */
  public async clean() {
    const distDir = this.project.build.getDistPath();
    const typesDir = this.project.build.getTypesPath();

    return Promise.all([
      del(distDir, { force: true }),
      del(typesDir, { force: true }),
    ]);
  }
}

export default Backend;
