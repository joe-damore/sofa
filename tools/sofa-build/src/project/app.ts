import path from 'path';
import fs from 'fs';
import Alias from './alias';
import Build from './build';
import Renderer from './renderer';

// TODO Document `App` class.
class App {

  /**
   * The human-friendly name of this app.
   *
   * @var string
   */
  public friendlyName: string;

  /**
   * The path to the project for this app.
   *
   * @var string
   */
  public path: string;

  /**
   * The build configuration information for this app.
   *
   * @var Build
   */
  public build: Build;

  /**
   * Constructor.
   *
   * @param {string} friendlyName - Human-friendly app name.
   * @param {string} path - Path to project.
   */
  constructor(friendlyName: string, path: string, build: Build) {
    this.friendlyName = friendlyName;
    this.path = path;
    this.build = build;
  }

  /**
   * Returns the path to the entrypoint for the app's main process.
   *
   * @return {string} App main entrypoint path.
   */
  public getEntrypointPath(): string {
    return path.join(this.path, 'src', 'main', 'index.ts');
  }

  public getRenderers(): Renderer[] {
    const rendererDir = path.join(this.build.getSrcPath(), 'renderers');

    // Return an empty array if renderer directory does not exist.
    if (!fs.existsSync(rendererDir)) {
      return [];
    }

    return fs
      .readdirSync(rendererDir)
      .filter((dirname) => !dirname.startsWith('_'))
      .map((dirname) => {
        const rendererName = dirname;
        const rendererPath = path.join(rendererDir, dirname);
        const rendererEntrypoint = path.join(rendererPath, 'index.tsx');
        return {
          name: rendererName,
          path: rendererPath,
          entrypoint: rendererEntrypoint,
        };
      })
      .filter((renderer) => fs.existsSync(renderer.entrypoint));
  }

  /**
   * Returns an array of entrypoint paths for this app's renderers.
   *
   * @return {String[]} Array of entrypoint paths for app renderers.
   */
  public getRendererEntrypointPaths(): string[] {
    return this
      .getRenderers()
      .map((renderer: Renderer) => renderer.entrypoint);
  }

  /**
   * Returns an array of aliases for this app.
   *
   * @return {Alias[]} Array of aliases for app.
   */
  public getAliases(): Alias[] {
    return [
      { alias: '@project', path: path.join(this.path) },
      { alias: '@projectAssets', path: path.join(this.build.getSrcPath(), 'renderers', '_assets') },
      { alias: '@src', path: this.build.getSrcPath() },
      { alias: '@main', path: path.join(this.build.getSrcPath(), 'main') }
    ];
  }

  /**
   * Returns an array of renderer-specific aliases for this app.
   *
   * @param {string} rendererName - Name of renderer for which to get aliases.
   *
   * @return {Alias[]} Array of renderer aliases for this app.
   */
  public getRendererAliases(rendererName: string): Alias[] {
    return [
      { alias: '@renderer', path: path.join(this.build.getSrcPath(), 'renderers', rendererName) },
      { alias: '@assets', path: path.join(this.build.getSrcPath(), 'renderers', rendererName, '_assets') },
    ];
  }
}

export default App;
