import nodePath from 'path'; // Imported as 'nodePath' to avoid confusion with 'path' class member.

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
   * The path to the entrypoint for this library.
   *
   * This path is relative to the project path.
   *
   * @var string
   */
  public entrypoint: string = nodePath.join('.', 'src', 'index.ts');

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
  constructor(objectName: string, path: string, build: Build, entrypoint?: string) {
    this.objectName = objectName;
    this.path = path;
    this.build = build;
    this.entrypoint = (entrypoint ? entrypoint : this.entrypoint);
  }

  /**
   * Returns the path to the entrypoint for this library.
   *
   * @return {string} Path to library entrypoint.
   */
  public getEntrypointPath(): string {
    const entrypoint = nodePath.resolve(this.path, this.entrypoint);
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
