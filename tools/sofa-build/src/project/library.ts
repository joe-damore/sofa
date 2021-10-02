import path from 'path';

import Alias from './alias';
import Build from './build';

/**
 * Describes the configuration of a library project.
 */
class Library {

  /**
   * Name of the compiled library object.
   *
   * This value must be a suitable JavaScript variable name.
   *
   * @var string
   */
  public objectName: string;

  /**
   * The path to the project for this library.
   *
   * @var string
   */
  public path: string;

  /**
   * The build configuration information for this library.
   *
   * @var Build
   */
  public build: Build;

  /**
   * Constructor.
   *
   * @param {string} objectName - Name of compiled library object.
   * @param {string} path - Path to project for library.
   */
  constructor(objectName: string, path: string, build: Build) {
    this.objectName = objectName;
    this.path = path;
    this.build = build;
  }

  /**
   * Returns the path to the entrypoint for this library.
   *
   * @return {string} Path to library entrypoint.
   */
  public getEntrypointPath(): string {
    const entrypoint = path.resolve(this.path, 'src', 'index.ts');
    return entrypoint;
  }

  /**
   * Returns an array of aliases for this app.
   *
   * @return {Alias[]} Array of aliases for app.
   */
  public getAliases(): Alias[] {
    return [
      { alias: '@src', path: this.build.getSrcPath() },
    ];
  }
}

export default Library;
