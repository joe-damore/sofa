import path from 'path';
import fs from 'fs';

/**
 * Finds build files in the given directory.
 */
class BuildFileFinder {
  /**
   * Path to directory in which to search for build file.
   */
  public path: string;

  /**
   * Array of allowed build file filenames.
   *
   * @type string[]
   */
  public allowedFilenames: string[] = ['.sofa-build.yml', '.sofa-build.yaml'];

  /**
   * Constructor.
   *
   * @param {string} path - Path to directory containing build file.
   */
  constructor(path: string) {
    this.path = path;
  }

  /**
   * Finds a build file in this build file finder's `path`.
   *
   * If no build file is found, `null` is returned.
   *
   * @return {string|null} Path to build file, or `null`.
   */
  public findBuildFile(): string | null {
    for(let i = 0; i < this.allowedFilenames.length; i += 1) {
      const filename = this.allowedFilenames[i];
      const buildFilePath = path.resolve(this.path, filename);

      if (fs.existsSync(buildFilePath)) {
        return buildFilePath;
      }
    }
    return null;
  }
}

export default BuildFileFinder;
