import { LoaderOptions } from './interface/loader-options.interface';
import { SCSSLoader } from './loader/scss.loader';

/**
 * Creates an SCSS loader configuration for handling SCSS files.
 *
 * @author necm1 (https://github.com/necm1)
 * @param {boolean} dev - Indicates if the environment is in development mode.
 * @param {string[]} dirs - An array of directories where the SCSS files are located.
 * @param {RegExp} regex - A regular expression for matching SCSS files.
 * @param {(match: RegExpMatchArray) => string} getTailwindConfigPath - A function that returns the path to the Tailwind CSS configuration file based on a regular expression match.
 * @param {any} [cssLoaderConfiguration] - Optional configuration for the CSS loader.
 * @param {any} [postcssPlugins] - Optional configuration for PostCSS plugins.
 * @return {Object} The SCSS loader configuration object.
 */
export const scssLoader = (options: LoaderOptions) => {
  return new SCSSLoader(options).getSCSSLoader();
};