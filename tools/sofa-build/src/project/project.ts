import Build from './build';
import App from './app';
import Library from './library';

/**
 * A project to be built.
 */
class Project {

  /**
   * Project name.
   *
   * This is used primarily for console output. It is typical for this value to
   * match the name of the project directory.
   *
   * @var string
   */
  public name: string;

  /**
   * Path to directory containing project.
   *
   * @var string
   */
  public path: string;

  /**
   * Build configuration info.
   *
   * @var Build;
   */
  public build: Build;

  /**
   * App build info.
   *
   * This should be set only if the project represents an app.
   *
   * @var App
   */
  public app?: App;

  /**
   * Library build info.
   *
   * This should be set only if the project represents a library.
   *
   * @var Library
   */
  public lib?: Library;

  /**
   * Constructor.
   *
   * @param {string} name - Name of project.
   * @param {string} path - Path to project directory.
   * @param {Build} build - Build config info.
   */
  constructor(name: string, path: string, build: Build) {
    this.name = name;
    this.path = path;
    this.build = build;
  }
}

export default Project;
