# Webpack template

- `src` directory: `index.html`, `index.js`, `style.css`
- `npm init -y` --> installs `package.json`
- `npm install --save-dev webpack webpack-cli` --> installs `webpack` and `webpack-cli`
- `npm install --save-dev html-webpack-plugin` --> installs `html-webpack-plugin`. Handles HTML
- `npm install --save-dev style-loader css-loader` --> installs `css-loader` and `style-loader`. Handles CSS
- `npm install --save-dev html-loader` --> installs `html-loader`. Handles image files referenced in our HTML template
- `npm install --save-dev webpack-dev-server` --> installs `webpack-dev-server` to handle live changes
- `npm install normalize.css` --> installs `normalize.css`
- `npm install --save-dev csv-loader xml-loader` --> installs `xml-loader` and `csv-loader`
- `webpack.config.js` configuration file
- `.gitignore` Node template

Bundle: `npx webpack`
Run: `npx webpack serve`

# Linter (ESLint)

- `npm init @eslint/config@latest` --> installs `@eslint/js` and `eslint`
- `eslint.config.mjs` configuration file

Run: `npx eslint src/index.js`

# Formatter (Prettier)

- `npm install --save-dev --save-exact prettier` --> installs `prettier`
- `.prettierrc` configuration file
- `.prettierignore` configuration file specifies which files to not format

Run: `npx prettier . --write`
