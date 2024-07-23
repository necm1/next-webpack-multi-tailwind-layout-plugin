# Next.js Multi-Tailwind Layout Plugin

This plugin allows you to use multiple Tailwind CSS configurations in a Next.js project. It dynamically loads the appropriate Tailwind configuration based on the layout being used. This is particularly useful when you have a monorepo setup with multiple packages, each with its own Tailwind configuration.

## Installation

Install the plugin via npm or yarn:

```sh
npm install next-webpack-multi-tailwind-layout-plugin
# or
yarn add next-webpack-multi-tailwind-layout-plugin
```

## Usage (Example)

### Directory Structure

Assume you have the following directory structure:

```
my-monorepo/
├── apps/
│   └── next/
│       └── next.config.js
├── packages/
│   ├── layout-one/
│   │   ├── src/
│   │   │   └── style.scss
│   │   └── tailwind.config.js
│   └── layout-two/
│       ├── src/
│       │   └── style.scss
│       └── tailwind.config.js
├── node_modules/
├── package.json
└── yarn.lock
```

### next.config.js

In your `next.config.js`, use the plugin to configure the SCSS loader with multiple Tailwind configurations.

```js
const { composePlugins, withNx } = require('@nx/next');
const { resolve } = require('path');
const fs = require('fs');
const scssLoader = require('next-webpack-multi-tailwind-layout-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const resolveDirectories = (baseDir, pattern) => {
  return fs.readdirSync(baseDir)
    .filter((dir) => new RegExp(pattern).test(dir))
    .map((dir) => resolve(baseDir, dir));
};

const nextConfig = {
  nx: {
    svgr: true,
  },
  webpack: (config, { dev, isServer }) => {
    const layoutDirs = resolveDirectories(resolve(__dirname, '../../packages'), /^layout-/);

    const tailwindConfigResolver = (match) => {
      return resolve(__dirname, `../../packages/layout-${match[1]}/tailwind.config.js`);
    };

    config.module.rules.forEach((rule) => {
      if (rule.oneOf) {
        rule.oneOf.forEach((oneOfRule) => {
          if (
            oneOfRule.test &&
            oneOfRule.test.toString().includes('(?<!\.module)\.(scss|sass)$') &&
            oneOfRule.use &&
            Array.isArray(oneOfRule.use)
          ) {
            oneOfRule.exclude = [
              ...(oneOfRule.exclude || []),
              // Regex to exclude layout-*/src/style.scss
              /packages\/layout-.*\/src\/style\.scss/,
            ];
          }
        });
      }
    });

    config.module.rules.push(
      scssLoader({
        dev,
        dirs: layoutDirs,
        // Regex to include layout-*/src/style.scss with scssLoader
        regex: /packages\/layout-(.*)\/src\/style\.scss$/,
        getTailwindConfigPath: tailwindConfigResolver,
      })
    );

    if (!dev) {
      if (!config.plugins) {
        config.plugins = [];
      }

      config.plugins.push(
        new MiniCssExtractPlugin({
          filename: 'static/css/[name].[contenthash].css',
          chunkFilename: 'static/css/[name].[contenthash].css',
        })
      );
    }

    return config;
  },
};

const plugins = [
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
```

### Example Layout Component

```tsx
// packages/layout-one/src/layout.tsx
import './style.scss';

export default function LayoutOne({ children }) {
  return (
    <html>
        <body>
            {children}
        </body>
    </html>
  );
};
```

```scss
// packages/layout-one/src/style.scss
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  /* even custom colors from your tailwind.config.js will be usable now */
  @apply bg-gray-100;
}
```
## Dynamic Import Example

To dynamically import `layout-one/src/layout.tsx`, you can use the following example:

```jsx
// apps/next/app/layout.tsx
import dynamic from 'next/dynamic';

// Dynamically import the layout component based on some condition or configuration
// you can also use path aliases
const LayoutOne = dynamic(() => import('../../packages/layout-one/src/layout'), {
  ssr: false,
});

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <LayoutOne>
      {children}
    </LayoutOne>
  );
}

```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs or enhancements.