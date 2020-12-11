// // const withPlugins = require("next-compose-plugins");

// // // const nextConfigs = {
// // //   images: {
// // //     domains: ["localhost", "http://app:4000", "app"],
// // //   },
// // //   webpack: (config) => {
// // //     // Fixes npm packages that depend on `fs` module
// // //     config.node = {
// // //       fs: "empty",
// // //     };
// // //     config.plugins = [...config.plugins];
// // //     return config;
// // //   },
// // //   target: "serverless",
// // // };

// // // images: {
// // //   domains: ["localhost", "http://app:4000", "app"],
// // // },
// // // ...withCSS({
// // //   cssModules: true,
// // //   cssLoaderOptions: {
// // //     importLoaders: 1,
// // //     localIdentName: "[local]___[hash:base64:5]",
// // //   },
// // //   ...withLess(
// // //     withSass({
// // //       lessLoaderOptions: {
// // //         javascriptEnabled: true,
// // //       },
// // //     })
// // //   ),
// // // }),
// // // ...withPlugins(
// // module.exports = withPlugins(
// //   [
// withCSS({
//   cssModules: true,
//   cssLoaderOptions: {
//     importLoaders: 1,
//     localIdentName: "[local]___[hash:base64:5]",
//   },
//   ...withLess(
//     withSass({
//       lessLoaderOptions: {
//         javascriptEnabled: true,
//       },
//     })
//   ),
// }),
// //   ],
// //   {
// //     images: {
// //       domains: ["localhost", "http://app:4000", "app"],
// //     },
// //   }
// // );

/* eslint-disable */
const lessToJS = require("less-vars-to-js");
const withPlugins = require("next-compose-plugins");
const withSass = require("@zeit/next-sass");
const withLess = require("@zeit/next-less");
const withCSS = require("@zeit/next-css");
const fs = require("fs");
const path = require("path");

// Where your antd-custom.less file lives
// const themeVariables = lessToJS(
//   fs.readFileSync(path.resolve(__dirname, "./src/styles/antd.less"), "utf8")
// );

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

// ...withLess({
//   lessLoaderOptions: {
//     javascriptEnabled: true,
//     modifyVars: themeVariables, // make your antd custom effective
//   },
//   webpack: (config, { isServer }) => {
//     if (isServer) {
//       const antStyles = /antd\/.*?\/style.*?/;
//       const origExternals = [...config.externals];
//       config.externals = [
//         (context, request, callback) => {
//           if (request.match(antStyles)) return callback();
//           if (typeof origExternals[0] === "function") {
//             origExternals[0](context, request, callback);
//           } else {
//             callback();
//           }
//         },
//         ...(typeof origExternals[0] === "function" ? [] : origExternals),
//       ];

//       config.module.rules.unshift({
//         test: antStyles,
//         use: "null-loader",
//       });
//     }
//     return config;
//   },
// }),

// const withSass = require("@zeit/next-sass");
// const withLess = require("@zeit/next-less");
// const withCSS = require("@zeit/next-css");
// //const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin");

// const isProd = process.env.NODE_ENV === "production";

// // fix: prevents error when .less files are required by node
// if (typeof require !== "undefined") {
//   require.extensions[".less"] = (file) => {};
// }

// module.exports = {
//   images: {
//     domains: ["localhost", "http://app:4000", "app"],
//   },
//   ...withCSS({
//     cssModules: true,
//     cssLoaderOptions: {
//       importLoaders: 1,
//       localIdentName: "[local]___[hash:base64:5]",
//     },
//     ...withLess(
//       withSass({
//         lessLoaderOptions: {
//           javascriptEnabled: true,
//         },
//       })
//     ),
//   }),
// };
