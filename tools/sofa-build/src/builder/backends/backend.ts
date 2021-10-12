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
    const libDistDir = this.project.build.getLibDistPath();
    const umdDistDir = this.project.build.getUmdDistPath();
    const typesDir = this.project.build.getTypesPath();

    let cleanPromises = [
      del(typesDir, { force: true }),
    ];

    if (this.project.app) {
      cleanPromises.push(del(distDir, { force: true }));
    }

    if (this.project.lib) {
      cleanPromises.push(del(umdDistDir, { force: true }));
      cleanPromises.push(del(libDistDir, { force: true }));
    };

    return Promise.all(cleanPromises);
  }
}

export default Backend;
