import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { LoaderOptions } from '../interface/loader-options.interface';

/**
 * SCSSLoader class.
 *
 * @class SCSSLoader
 * @author necm1 (https://github.com/necm1)
 */
export class SCSSLoader {
  private dev: boolean;
  private dirs: string[];
  private regex: RegExp;
  private getTailwindConfigPath: (match: RegExpMatchArray) => string;
  private cssLoaderConfiguration?: any;
  private postcssPlugins?: any[];

  /**
   * Constructor for SCSSLoader class.
   *
   * @param {LoaderOptions} options - The SCSSLoader options.
   */
  constructor(options: LoaderOptions) {
    this.dev = options.dev;
    this.dirs = options.dirs;
    this.regex = options.regex;
    this.getTailwindConfigPath = options.getTailwindConfigPath;
    this.cssLoaderConfiguration = options.cssLoaderConfiguration;
    this.postcssPlugins = options.postcssPlugins;
  }

  /**
   * Returns a Webpack loader configuration for handling SCSS files.
   *
   * @return {Object} The Webpack loader configuration object.
   */
  public getSCSSLoader() {
    return {
      test: this.regex,
      use: [
        this.dev ? 'style-loader' : MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          ...this.cssLoaderConfiguration,
        },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: (loaderContext: any) => {
              const pathMatch = loaderContext.resourcePath.match(this.regex);

              if (pathMatch) {
                const tailwindConfigPath =
                  this.getTailwindConfigPath(pathMatch);

                return {
                  plugins: [
                    postcssImport({
                      path: [...this.dirs],
                    }),
                    tailwindcss(tailwindConfigPath),
                    autoprefixer(),
                    ...(this.postcssPlugins || []),
                  ],
                };
              }
              return {};
            },
          },
        },
        'sass-loader',
      ],
    };
  }
}
