const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * The function accepts a config with a path for page templates templatesPath
 * and options that can be passed to these templates.
 * Returns an array of HtmlWebpackPlugin generated for
 * of each html file found in templatesPath.
 *
 * @param templatesPath
 * @param options
 * @returns {HtmlWebpackPlugin[]}
 */
const generateHtmlPlugins = ({ templatesPath, options = {} }) => {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templatesPath));
  const htmlFiles = templateFiles.filter(templateFile => {
    const parts = templateFile.split('.');
    return parts[1] === 'html';
  });

  return htmlFiles.map(htmlFile => {
    const [name, extension] = htmlFile.split('.');

    return new HtmlWebpackPlugin({
      title: options.title || 'Create HTML Boilerplate',
      filename: `${name}.html`,
      template: path.resolve(
        __dirname,
        `${templatesPath}/${name}.${extension}`,
      ),
      inject: true,
      custom: options,
    });
  });
};

module.exports = generateHtmlPlugins;
