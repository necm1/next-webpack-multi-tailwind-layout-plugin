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
  /**
   * Constructor for SCSSLoader class.
   *
   * @param {LoaderOptions} options - The SCSSLoader options.
   */
  constructor(private options: LoaderOptions) {}

  /**
   * Returns a Webpack loader configuration for handling SCSS files.
   *
   * @return {Object} The Webpack loader configuration object.
   */
  public getSCSSLoader() {
    const { dev, dirs, regex, getTailwindConfigPath, cssLoaderConfiguration, postcssPlugins } = this.options;

    return {
      test: regex,
      use: [
        dev ? 'style-loader' : MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          ...cssLoaderConfiguration,
        },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: (loaderContext: any) => {
              const pathMatch = loaderContext.resourcePath.match(regex);

              if (pathMatch) {
                const tailwindConfigPath = getTailwindConfigPath(pathMatch);

                return {
                  plugins: [
                    postcssImport({
                      path: [...dirs],
                    }),
                    tailwindcss(tailwindConfigPath),
                    autoprefixer(),
                    ...(postcssPlugins || []),
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
