const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const project_path = path.resolve(__dirname, '../');
const SRC_PATH = `${project_path}/src`;
const DIST_PATH = `${project_path}/dist`;

// 打包环境
const NODE_ENV = process.env.NODE_ENV === 'product' ? 'product' : 'dev';
const config = {
  mode: NODE_ENV === 'dev' ? 'development' : 'production',
  // 入口目录
  context: SRC_PATH,
  // 入口文件
  entry: {
    app: [`${SRC_PATH}/main.js`]
  },
  externals: {
    'vue': 'Vue',
    'element-ui': 'elementUI'
  },
  //入口文件输出配置
  output: {
    path: DIST_PATH,// 指定编译生成目录，不能用于html中的js引用 
    // publicPath: `${SRC_PATH}/asserts`,// 指定资源文件引用的目录 虚拟目录，自动指向path编译目录 html中引用js文件时，必须引用此虚拟路径（但实际上引用的是内存中的文件
    publicPath: '/',
    sourceMapFilename: '[file].map',
    filename: 'bundle.js' // 指定打包为一个文件 bundle.js  打包之后的文件,html模板中引入此文件
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin(),//全局开启热代码替换
    new copyWebpackPlugin([{
      from: `${project_path}/static`,//打包的静态资源目录地址
      to: DIST_PATH //打包到dist下面的public
    }, {
      from: `${SRC_PATH}/index.html`,
      to: DIST_PATH
    }]),
  ],
  devServer: {
    disableHostCheck: true,
  },
  module: {
    //加载器配置
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: path.normalize(project_path + '/node_modules') },
      //.css 文件使用 style-loader 和 css-loader 来处理
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      //.less 文件使用 style-loader、css-loader 和 less-loader 来编译处理
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader?sourceMap' },
      {
        test: /\.vue$/, loader: 'vue-loader', options: {
          transformToRequire: {
            video: ['src', 'poster'],
            source: 'src',
            img: 'src',
            image: 'xlink:href'
          }
        }
      },
      // edit this for additional asset file types
      { test: /\.(png|jpg|gif)$/, loader: 'url-loader' },
      //{ test: /\.(eot|woff|ttf)$/, loader: 'file-loader' }
    ]
  },
  //加载器配置 
  resolve: {
    //查找module的话从这里开始查找
    //root: 'D:/WebSite', //绝对路径
    //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
    extensions: ['.vue', '.js', '.json', '.scss'],
    //模块别名定义，方便后续直接引用别名，无须多写长长的地址
    alias: {
      //AppStore: 'js/stores/AppStores.js'//后续直接 require('AppStore') 即可
      //'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(SRC_PATH),
    }
  }
};
if (NODE_ENV === 'product') {
  config.plugins.unshift(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      drop_console: true,
      pure_funcs: ['console.log']
    },
    sourceMap: false
  }));
  config.plugins.push(new BundleAnalyzerPlugin());
  config.plugins.push(new webpack.DefinePlugin({ NODE_ENV: '"product"' }))
} else {
  config.plugins.push(new webpack.DefinePlugin({ NODE_ENV: '"dev"' }));
}
module.exports = config;