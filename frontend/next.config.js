const withPlugins = require("next-compose-plugins");
const withSass = require("@zeit/next-sass");
const withLess = require("@zeit/next-less");
const withCSS = require("@zeit/next-css");

module.exports = withPlugins(
  [
    withCSS({
      cssModules: true,
      cssLoaderOptions: {
        importLoaders: 1,
        localIdentName: "[local]___[hash:base64:5]",
      },
      ...withLess(
        withSass({
          lessLoaderOptions: {
            javascriptEnabled: true,
          },
        })
      ),
    }),
  ],
  {
    images: {
      domains: ["localhost", "http://app:4000", "app", "api.mcuve.com"],
    },
  }
);
