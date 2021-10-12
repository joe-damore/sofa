import path from 'path';

/**
 * Describes the configuration of a build for a project.
 */
class Build {

  /**
   * Build backend.
   */
  public backend: string = 'webpack';

  /**
   * The path to the project source, relative to the project path.
   */
  public srcPath: string = './src';

  /**
   * The path to the project dist, relative to the project path.
   */
  public distPath: string = './dist';

  /**
   * The path to the project dist for libraries, relative to the project path.
   */
  public libDistPath: string = './lib';

  /**
   * The path to the project's UMD dist, relative to the project path.
   *
   * Only applicable for library projects.
   */
  public umdDistPath: string = './_bundles';

  /**
   * The path to the project types, relative to the project path.
   */
  public typesPath: string = './types';

  /**
   * The path to the project for this build.
   *
   * @var string
   */
  public path: string;

  /**
   * Constructor.
   *
   * @param {string} path - Path to project for build.
   * @param {string?} backend - Build backend.
   * @param {string?} srcPath - Path to project source.
   * @param {string?} distPath - Path to project dist.
   * @param {string?} umdDistPath - Path to project UMD dist.
   * @param {string?} typesPath - Path to project types.
   */
  constructor(
    path: string,
    backend?: string,
    srcPath?: string,
    distPath?: string,
    libDistPath?: string,
    umdDistPath?: string,
    typesPath?: string) {
    this.path = path;
    this.backend = (backend ? backend : this.backend);
    this.srcPath = (srcPath ? srcPath : this.srcPath);
    this.distPath = (distPath ? distPath : this.distPath);
    this.libDistPath = (libDistPath ? libDistPath : this.libDistPath);
    this.umdDistPath = (umdDistPath ? umdDistPath : this.umdDistPath);
    this.typesPath = (typesPath ? typesPath : this.typesPath);
  }

  /**
   * Returns a path to the project source directory.
   *
   * @returns {string} Path to project source directory.
   */
  public getSrcPath(): string {
    return path.join(this.path, this.srcPath);
  }

  /**
   * Returns a path to the project dist directory.
   *
   * @returns {string} Path to project dist directory.
   */
  public getDistPath(): string {
    return path.join(this.path, this.distPath);
  }

  /**
   * Returns a path to the project library dist directory.
   *
   * @returns {string} Path to project library dist directory.
   */
  public getLibDistPath(): string {
    return path.join(this.path, this.libDistPath);
  }

  /**
   * Returns a path to the project UMD dist directory.
   *
   * @returns {string} Path to project UMD dist directory.
   */
  public getUmdDistPath(): string {
    return path.join(this.path, this.umdDistPath);
  }

  /**
   * Returns a path to the project types directory.
   *
   * @returns {string} Path to project types directory.
   */
  public getTypesPath(): string {
    return path.join(this.path, this.typesPath);
  }
}

export default Build;
