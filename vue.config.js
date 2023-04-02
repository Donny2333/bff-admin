const { defineConfig } = require("@vue/cli-service");
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, "./", dir);
}
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    port: 8080,
    proxy: {
      // "/loginuser": {
      //   target: "http://10.32.226.28:9099/",
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "^/loginuser": "/loginuser",
      //   },
      // },
      // "/message": {
      //   target: "http://dataspace.dev/",
      //   changeOrigin: true,
      //   compress: false,
      //   pathRewrite: {
      //     "^/message": "/message",
      //   },
      // },
      "/api": {
        target: "http://dev.biz.dataspace.cestc.cn",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api",
        },
      },
    },
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [
        // 全局变量路径
        path.resolve(__dirname, "./src/assets/style/index.less"),
      ],
    },
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload

    config.plugins.delete("prefetch");
    // when there are many pages, it will cause too many meaningless requests
    config.module
      // 规则
      .rule("svg")
      // 忽略
      .exclude.add(resolve("src/icons"))
      // 结束
      .end();
    // config.module 表示创建一个具名规则，以后用来修改规则
    config.module
      // 规则
      .rule("icons")
      // 正则，解析 .svg 格式文件
      .test(/\.svg$/)
      // 解析的文件
      .include.add(resolve("src/icons"))
      // 结束
      .end()
      // 新增了一个解析的loader
      .use("svg-sprite-loader")
      // 具体的loader
      .loader("svg-sprite-loader")
      // loader 的配置
      .options({
        symbolId: "icon-[name]",
      })
      // 结束
      .end();
  },
});
