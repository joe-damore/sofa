import fs from 'fs';
import path from 'path';
import JSON5 from 'json5';
import webpack from 'webpack';
import { promisify } from 'util';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import BuildResults from '../build-results';
import Project from '../../project/project';
import Alias from '../../project/alias';
import Renderer from '../../project/renderer';
import Backend from './backend';

const tsconfigPath = path.resolve(__dirname, '..', '..', '..', 'tsconfig.build.json');
const tsconfigData = fs.readFileSync(tsconfigPath, 'utf8');
const tsconfig = JSON5.parse(tsconfigData);

// Webpack .SCSS loader rule.
const scssModule = {
  test: /\.scss$/,
  use: [
    'style-loader',
    'css-loader',
    'sass-loader',
  ],
};

// Webpack font and image loading rule.
const assetModule = {
  test: /\.(png|jpg|svg|webp|woff|woff2)$/,
  type: 'asset/resource',
};

/**
 * Converts an array of Alias instances to a Webpack alias map.
 *
 * @param {Aliases[]} alias - Array of aliases.
 *
 * @returns {Object} Webpack alias object.
 */
const aliasesToWebpackAliases = (aliases: Alias[]): Object => {
  return aliases.reduce((cur: Alias, acc: any): any => {
    acc[cur.alias] = cur.path;
    return acc;
  });
};

// Webpack TypeScript loading rule.
const tsModule = (project: Project, entryDir: string) => {
  return {
    test: /\.tsx?$/,
    loader: 'ts-loader',
    options: {
      configFile: tsconfigPath,
      compilerOptions: {
        ...tsconfig.compilerOptions,
        declarationDir: project.build.getTypesPath(),
        // TODO Make this vary based on build mode.
        sourceMap: true,
      },
      context: path.resolve(project.path),
    },
    include: [entryDir],
    exclude: /node_modules/,
  };
};

/**
 * Webpack build backend.
 *
 * Builds Sofa projects using Webpack 5.
 */
class WebpackBackend extends Backend {

  /**
   * Returns the name of the backend.
   *
   * For `WebpackBackend`, the returned value is always `'Webpack'`.
   *
   * @returns {string} Name of backend.
   */
  public getName() {
    return 'Webpack';
  }

  /**
   * Returns an array of Webpack configs for Sofa libraries.
   *
   * If the project being built is not a library, the returned array is empty.
   *
   * @returns {Object[]} An array of Webpack config objects.
   */
  public getLibConfigs(): Object[] {
    if (!this.project.lib) {
      return [];
    }

    const baseConfig = {
      target: 'node',
      // TODO Make build mode configurable.
      mode: 'development',
      entry: {
        [this.project.name]: path.resolve(this.project.lib.getEntrypointPath()),
      },
      output: {
        filename: '[name].min.js',
        library: this.project.lib.objectName,
      },
      // TODO Make value vary depending on build mode.
      devtool: 'eval-source-map',
      module: {
        rules: [
          scssModule,
          assetModule,
          tsModule(this.project, path.dirname(this.project.lib.getEntrypointPath())),
        ],
      },
      resolve: {
        extensions: ['.ts', '.tsx'],
        alias: aliasesToWebpackAliases(this.project.lib.getAliases()),
      },
      // TODO Make value vary depending on build mode.
      optimization: {
        minimize: true,
      },
    }

    return [
      // UMD Output
      {
        ...baseConfig,
        output: {
          ...baseConfig.output,
          path: path.resolve(this.project.build.getUmdDistPath()),
          libraryTarget: 'umd',
          umdNamedDefine: true,
        },
      },
      // CommonJS Output
      {
        ...baseConfig,
        output: {
          ...baseConfig.output,
          path: path.resolve(this.project.build.getLibDistPath()),
          libraryTarget: 'commonjs2',
        },
      },
    ];
  }

  /**
   * Returns an array of main app Webpack configurations.
   *
   * This is typically an array containing only one configuration object.
   * However, if the project being built is not an app, an empty array is
   * returned instead.
   *
   * @returns {Object[]} Array of main app Webpack configuration objects.
   */
  public getMainAppConfigs(): Object[] {
    if (!this.project.app) {
      return [];
    }

    return [{
      target: 'electron-main',
      // TODO Make build mode configurable.
      mode: 'development',
      entry: {
        main: path.resolve(this.project.app.getEntrypointPath()),
      },
      output: {
        path: path.resolve(this.project.build.getDistPath(), 'main'),
        filename: 'main.bundle.js',
      },
      module: {
        rules: [
          scssModule,
          assetModule,
          tsModule(this.project, path.dirname(this.project.app.getEntrypointPath())),
        ],
      },
      resolve: {
        extensions: ['.ts', '.tsx'],
        alias: aliasesToWebpackAliases(this.project.app.getAliases()),
      },
      optimization: {
        // TODO Make this vary based on build mode.
        minimize: true,
      },
      // TODO Make this vary based on build mode.
      devtool: 'eval-source-map',
    }];
  }

  /**
   * Returns an array of Webpack app renderer configuration objects.
   *
   * If the project being built is not an app, an empty array is returned.
   *
   * @returns {Object[]} Array of Webpack renderer app configuration objects.
   */
  public getRendererAppConfigs(): Object[] {
    if (!this.project.app) {
      return [];
    }
    const app = this.project.app;
    return this.project.app.getRenderers().map((renderer: Renderer): Object => {

      const mainEntry = {
        'bundle': path.resolve(renderer.entrypoint),
      }

      const preloadEntry = (renderer.preload) ? {
        'preload': path.resolve(renderer.path, 'preload.ts'),
      } : {};

      return {
        target: 'electron-renderer',
        // TODO Allow this to vary depending on config.
        mode: 'development',
        entry: {
          ...mainEntry,
          ...preloadEntry,
        },
        output: {
          path: path.resolve(this.project.build.getDistPath(), 'renderers', renderer.name),
          filename: 'renderer.[name].js',
        },
        module: {
          rules: [
            scssModule,
            assetModule,
            tsModule(this.project, path.dirname(path.resolve(renderer.entrypoint))),
          ],
        },
        plugins: [
          new HtmlWebpackPlugin(),
        ],
        resolve: {
          extensions: ['.ts', '.tsx'],
          alias: aliasesToWebpackAliases([
            ...app.getAliases(),
            ...app.getRendererAliases(renderer.name),
          ]),
        },
        optimization: {
          // TODO Allow this to vary based on build mode.
          minimize: true,
        },
        // TODO Allow this to vary based on build mode.
        devtool: 'eval-source-map',
      };
    });
  }

  public getWebpackConfigs(): Object[] {
    const configs = [
      ...this.getLibConfigs(),
      ...this.getRendererAppConfigs(),
      ...this.getMainAppConfigs(),
    ];
    return configs;
  }

  public async build(): Promise<BuildResults> {
    const webpackPromise = promisify(webpack);
    let stats = null;
    try {
      stats = await webpackPromise(this.getWebpackConfigs());
    }
    catch (e) {
      throw e;
    }
    if (!stats) {
      throw new Error('Webpack build failed; no stats returned.')
    }

    const jsonStats = stats.toJson();

    const errorMessages = (!!jsonStats.errors ? jsonStats.errors.map((error) => {
      return {
        filepath: error.file || 'Unknown',
        loc: error.loc || 'Unknown',
        message: error.message || 'Unknown',
      };
    }) : []);

    const warningMessages = (!!jsonStats.warnings ? jsonStats.warnings.map((warning) => {
      return {
        filepath: warning.file || 'Unknown',
        loc: warning.loc || 'Unknown',
        message: warning.message || 'Unknown',
      };
    }) : []);

    return new BuildResults(errorMessages, warningMessages);
  }
}

export default WebpackBackend;
