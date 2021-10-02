import BuildMessage from './build-message';

/**
 * Describes the results of a sofa build.
 */
class BuildResults {
  /**
   * Build errors.
   *
   * @type BuildMessage[]
   */
  public errors: BuildMessage[] = [];

  /**
   * Build warnings.
   *
   * @type BuildMessage[]
   */
  public warnings: BuildMessage[] = [];

  /**
   * Constructor.
   *
   * @param {BuildMessage[]} errors - Build errors.
   * @param {BuildMessage[]} warnings - Build warnings.
   */
  public constructor(errors: BuildMessage[], warnings: BuildMessage[]) {
    this.errors = errors;
    this.warnings = warnings;
  }

  /**
   * Returns `true` if the build has errors, `false` otherwise.
   *
   * @return {boolean} `true` if build has errors, `false` otherwise.
   */
  public hasErrors(): boolean {
    return (this.errors.length > 0);
  }

  /**
   * Returns `true` if the build has warnings, `false` otherwise.
   *
   * @return {boolean} `true` if build has warnings, `false` otherwise.
   */
  public hasWarnings(): boolean {
    return (this.warnings.length > 0);
  }

  /**
   * Returns `true` if the build has no errors, `false` otherwise.
   *
   * @return {boolean} `true` if build succeeded, `false` otherwise.
   */
  public isSuccessful(): boolean {
    return !(this.hasErrors());
  }
}

export default BuildResults;
