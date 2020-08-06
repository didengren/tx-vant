const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const GenerateTXRegistrationFilePlugin = require("@trinasolar/generate-tx-registration-file-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const fs = require("fs");

const OUTPUT_DIR =
  process.env.NODE_ENV === "debug"
    ? "release/test"
    : process.env.NODE_ENV === "production"
    ? "release/prod"
    : `release/${process.env.NODE_ENV}`;
const BLANK_TPL_FTL_PATH = path.posix.join(process.cwd(), "config.json");

let confJsonFtlInfo = {};
try {
  const fileInfo = fs.readFileSync(BLANK_TPL_FTL_PATH, "utf-8");
  confJsonFtlInfo = JSON.parse(fileInfo);
  if (
    !(
      Object.prototype.hasOwnProperty.call(confJsonFtlInfo, "name") &&
      Object.prototype.hasOwnProperty.call(confJsonFtlInfo, "identifier")
    )
  )
    throw new Error("config.json文件中的字段不正确");
} catch (error) {
  console.error("未成功获取config.json文件信息报错内容：\n", error);
}

/**
 * 脚本命令中获取版本号
 * @param {Array} argv process.argv
 * e.g. npm run debug-build -- --version-1.0.01
 */
const getVersion = (argv) => {
  let version = "0.0.1";
  // console.log("process.argv____", argv);
  const reg = new RegExp(/--versions/i);
  for (let i = 0; i < argv.length; i++) {
    if (~argv[i].search(reg)) version = argv[i] + 1 || "0.0.1";
  }
  return version;
};

function assetsPath(_path) {
  const ASSETS_DIR = "static";
  return path.posix.join(ASSETS_DIR, _path);
}

module.exports = {
  publicPath: process.env.NODE_ENV === "local" ? "/" : "./", // vueConf.baseUrl, // 根域上下文目录
  outputDir: OUTPUT_DIR, // 构建输出目录
  assetsDir: "static", // 静态资源目录 (js, css, img, fonts)
  lintOnSave: true, // 是否开启eslint保存检测，有效值：ture | false | 'error'
  runtimeCompiler: true, // 运行时版本是否需要编译
  transpileDependencies: [], // 默认babel-loader忽略mode_modules，这里可增加例外的依赖包名
  productionSourceMap: process.env.NODE_ENV === "local", // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
  css: {
    // 配置高于chainWebpack中关于css loader的配置
    // modules: true, // 是否开启支持‘foo.module.css’样式
    extract: process.env.NODE_ENV !== "local", // 是否使用css分离插件 ExtractTextPlugin，采用独立样式文件载入，不采用<style>方式内联至html文件中
    sourceMap: false, // 是否在构建样式地图，false将提高构建速度
    loaderOptions: {
      // css预设器配置项
      less: {}
    }
  },
  parallel: require("os").cpus().length > 1, // 构建时开启多进程处理babel编译
  pluginOptions: {
    // 第三方插件配置
    pwa: {
      iconPaths: {
        favicon32: "./favicon.ico",
        favicon16: "./favicon.ico",
        appleTouchIcon: "./favicon.ico",
        maskIcon: "./favicon.ico",
        msTileImage: "./favicon.ico"
      }
    }
  },
  configureWebpack: (config) => {
    config.optimization = {
      minimize: process.env.NODE_ENV !== "local",
      minimizer:
        process.env.NODE_ENV !== "local"
          ? [
              new TerserJSPlugin({
                sourceMap: false
                // terserOptions: {
                //   compress: {
                //     warnings: false,
                //     drop_console: true,
                //     drop_debugger: true,
                //     pure_funcs: ["console.log", "console.info", "console.error"]
                //   }
                // }
              }),
              new OptimizeCSSAssetsPlugin({})
            ]
          : [],
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              return `npm.${packageName.replace("@", "")}`;
            }
          },
          styles: {
            name: "styles",
            test: /\.css$/,
            chunks: "all",
            enforce: true
          }
        }
      }
    };
  },
  chainWebpack: (config) => {
    const versionStr = getVersion(process.argv);
    config.output.filename(assetsPath("js/[name].[hash:8].js")).end();
    config.output.chunkFilename(assetsPath("js/[name].[chunkhash:8].js")).end();
    config.plugin("extract-css").use(
      new MiniCssExtractPlugin({
        filename: assetsPath("css/[name].[hash:8].css"),
        chunkFilename: assetsPath("css/[id].[chunkhash:8].css")
      })
    );
    process.env.NODE_ENV !== "local" &&
      config.plugin("generate-tx-registration-file").use(
        new GenerateTXRegistrationFilePlugin(OUTPUT_DIR, null, {
          identifier: `com.trinasolar.${confJsonFtlInfo.identifier}.${process.env.NODE_ENV}`,
          name: confJsonFtlInfo.name,
          version: versionStr,
          build: versionStr.replace(/\./g, "")
        })
      );
    process.env.NODE_ENV !== "local" &&
      config.plugin("folder-as-compressed-package").use(
        new FileManagerPlugin({
          onEnd: {
            archive: [
              {
                source: OUTPUT_DIR,
                destination: `${OUTPUT_DIR}/${confJsonFtlInfo.name}-${process.env.NODE_ENV}-v${versionStr}.zip`,
                options: {
                  root: ""
                }
              }
            ]
          }
        })
      );
    config.module
      .rule("images")
      .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
      .use("url-loader")
      .loader("url-loader")
      .options({
        limit: 10000,
        name: assetsPath("img/[name].[hash:8].[ext]")
      });
    config.module
      .rule("svg")
      .test(/\.(svg)(\?.*)?$/)
      .use("url-loader")
      .loader("url-loader")
      .options({
        limit: 10000,
        name: assetsPath("img/[name].[hash:8].[ext]")
      });
  }
};
