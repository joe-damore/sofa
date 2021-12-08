import fs from 'fs';
import path from 'path';
import JSON5 from 'json5';
import webpack from 'webpack';
import { promisify } from 'util';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import util from 'util';

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
  type AliasMap = {
    [key: string]: string;
  }

  return aliases.reduce((acc: AliasMap, cur: Alias): any => {
    acc[cur.alias] = cur.path;
    return acc;
  }, {});
};

/**
 * Converts an array of Alias instances to a TypeScript alias map.
 *
 * @param {Aliases[]} alias - Array of aliases.
 *
 * @returns {Object} TypeScript alias object.
 */
const aliasesToTypeScriptAliases = (aliases: Alias[]): Object => {
  type AliasMap = {
    [key: string]: string[];
  }

  return aliases.reduce((acc: AliasMap, cur: Alias): any => {
    acc[`${cur.alias}/*`] = [path.join(cur.path, '*')];
    return acc;
  }, {});
};

// Webpack TypeScript loading rule.
const tsModule = (project: Project, entryDir: string, aliases?: Object) => {
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
        baseUrl: path.resolve(project.path),
        paths: aliases,
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

    const webpackAliases = aliasesToWebpackAliases(this.project.lib.getAliases());
    const typescriptAliases = aliasesToTypeScriptAliases(this.project.lib.getAliases());

    const baseConfig = {
      target: 'node',
      // TODO Make build mode configurable.
      mode: 'production',
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
          tsModule(this.project, path.dirname(this.project.lib.getEntrypointPath()), typescriptAliases),
        ],
      },
      resolve: {
        extensions: ['.ts', '.tsx'],
        alias: webpackAliases,
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

    const webpackAliases = aliasesToWebpackAliases(this.project.app.getAliases());
    const typescriptAliases = aliasesToTypeScriptAliases(this.project.app.getAliases());

    return [{
      target: 'electron-main',
      // TODO Make build mode configurable.
      mode: 'production',
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
          tsModule(this.project, path.join(this.project.path, 'src'), typescriptAliases),
        ],
      },
      resolve: {
        extensions: ['.ts', '.tsx'],
        alias: webpackAliases,
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

      const webpackAliases = aliasesToWebpackAliases([
        ...app.getAliases(),
        ...app.getRendererAliases(renderer.name),
      ]);

      const typescriptAliases = aliasesToTypeScriptAliases([
        ...app.getAliases(),
        ...app.getRendererAliases(renderer.name),
      ]);

      return {
        target: 'electron-renderer',
        // TODO Allow this to vary depending on config.
        mode: 'production',
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
            tsModule(this.project, path.dirname(path.resolve(renderer.entrypoint)), typescriptAliases),
          ],
        },
        plugins: [
          new HtmlWebpackPlugin({
            title: renderer.name,
            template: path.resolve(__dirname, '..', '..', '..', 'templates', 'html', 'index.ejs'),
            inject: false,
          }),
        ],
        resolve: {
          extensions: ['.ts', '.tsx'],
          alias: webpackAliases,
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
