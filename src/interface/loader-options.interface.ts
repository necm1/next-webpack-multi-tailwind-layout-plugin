/**
 * Interface for SCSSLoader options.
 *
 * @author necm1 (https://github.com/necm1)
 * @interface SCSSLoaderOptions
 */
export interface LoaderOptions {
    dev: boolean;
    dirs: string[];
    regex: RegExp;
    getTailwindConfigPath: (match: RegExpMatchArray) => string;
    cssLoaderConfiguration?: any;
    postcssPlugins?: any[];
}