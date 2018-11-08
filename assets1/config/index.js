const path = require('path')

module.exports = {
  dev: {
    // 路径
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    // 可被 by process.env.HOST 覆盖
    host: '10.11.2.94',
    // 可被 process.env.PORT 覆盖，
    // 如果端口已被使用，会用另一个空闲端口替换
    port: 8080,
    // 如果 true，服务器启动后自动在浏览器中打开页面
    autoOpenBrowser: false,
    // 如果 true，在浏览器上显示错误提示覆盖层
    errorOverlay: true,
    // 是否在文件系统提示区显示通知信息
    notifyOnErrors: true,
    // ？？？？？？？？？？？？？？？？？？
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // 是否启用 Eslint Loader？
    // 如果 true, 你的代码会在编码和打包时被校验，并在终端显示错误和警告。
    useEslint: true,
    // 如果 true, eslint 错误和警告会在浏览器上用覆盖层显示
    showEslintErrorsInOverlay: true,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    cssSourceMap: true,

    proxyTable: {
      // '/': {
      //   target: 'http://i.ways.cn/api/',
      //   changeOrigin: true,  //是否跨域
      //   // pathRewrite: function (path, req) {
      //   //   return /\/buildFile\//ig.test(path) ? `/enterprise/buildFile?${path.split('?')[1]}` : path
      //   // }
      //   // pathRewrite: {
      //   //   '^/enterprise': '/'   //重写接口
      //   // }
      // },

      '/mis004': {
        target: 'http://10.11.2.159:8094/',
        changeOrigin: true,  //是否跨域
        // pathRewrite: function (path, req) {
        //   return /\/buildFile\//ig.test(path) ? `/enterprise/buildFile?${path.split('?')[1]}` : path
        // }
        pathRewrite: {
          '^/mis004': '/'   //重写接口
        }
      },
      '/base-services-001': {
        target: 'http://i.ways.cn/api/',
        changeOrigin: true,  //是否跨域
        // pathRewrite: function (path, req) {
        //   return /\/buildFile\//ig.test(path) ? `/enterprise/buildFile?${path.split('?')[1]}` : path
        // }
        // pathRewrite: {
        //   '^/enterprise': '/'   //重写接口
        // }
      },

      // '/enterprise/incent': {
      //   // target: 'http://i.ways.cn/api/mis004/',
      //   target: 'http://10.11.2.159:8094/',
      //   // target: 'http://10.11.2.172:8081/', // 李朋
      //   changeOrigin: true,  //是否跨域
      //   // pathRewrite: function (path, req) {
      //   //   return /\/buildFile\//ig.test(path) ? `/enterprise/buildFile?${path.split('?')[1]}` : path
      //   // }
      //   pathRewrite: {
      //     '^/enterprise': '/'   //重写接口
      //   }
      // },
      // '/enterprise/reward': {
      //   // target: 'http://i.ways.cn/api/mis004/',
      //   target: 'http://10.11.2.159:8094/',
      //   // target: 'http://10.11.2.172:8081/', //李朋
      //   changeOrigin: true,  //是否跨域
      //   // pathRewrite: function (path, req) {
      //   //   return path;
      //   // }
      //   pathRewrite: {
      //     '^/enterprise': '/'   //重写接口
      //   }
      // },
      // '/enterprise/terminalStimulate': {
      //   // target: 'http://i.ways.cn/api/mis004/',
      //   target: 'http://10.11.2.159:8094/',
      //   // target: 'http://10.11.2.190:8081/', //裕换
      //   changeOrigin: true,  //是否跨域
      //   // pathRewrite: function (path, req) {
      //   //   return path;
      //   // }
      //   pathRewrite: {
      //     '^/enterprise': '/'   //重写接口
      //   }
      // },
      // '/enterprise': {
      //   target: 'http://i.ways.cn/api/base-services-001/', //公共筛选数据
      //   // target: 'http://192.168.4.27:8181/', //冯永森
      //   changeOrigin: true,  //是否跨域
      //   pathRewrite: {
      //     '^/enterprise': '/'   //重写接口
      //   }
      // },

      // '/download': {
      //   target: 'http://10.11.3.172:8080',
      //   bypass: function(req, res) {
      //     if (req.url.indexOf('/download') !== -1 && req.url.indexOf('.pdf') !== -1) {
      //       res.setHeader('Content-Disposition', 'attachment');
      //       return req.url.replace('/download', '');
      //     }
      //   }
      // }
    }
  },

  build: {
    // 产出的入口 html 地址
    index: path.resolve(__dirname, '../dist/index.html'),

    // 路径
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // 默认关闭 gzip 压缩功能，因为像 Surge 或 Netlify 等很多主流的
    // 静态资源服务提供商已经对您的所以静态资源文件进行了 gzip 压缩。
    // 在设置为 `true` 之前，需要确保以下插件已被安装:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // 使用额外的参数来运行 build 命令
    // 在构建完成后可看到构建分析报告：
    // `npm run build --report`
    // 设为 `true` 或 `false` 来打开或关闭
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
