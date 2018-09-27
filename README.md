# project-vue-admin
后台管理vue模板
webpack概念: https://www.webpackjs.com/concepts/
***
2018-9-26 21:25:07
```
config                  webpack配置目录
  webpack.js
static                  静态文件夹
src                     源文件目录
  assets                静态文件
  components            组件
  router                路由
    index.js
  App.vue               应用入口
  main.js               入口
.babelrc                babel配置
.gitignore              忽略文件
package.json
README.md
```
- 初始化项目
  - 编辑.gitignore node_modules
  - 编辑.babelrc TODO:
  - 添加config文件夹,三种环境配置
  - 静态文件放static目录
  - 源文件放src目录
  - git clone git@github.com:ruanjiayou/project-vue-admin.git
- npm初始化,npm init
- package.json脚步命令: 
  - dev: webpack-dev-server --inline --progress --config build/webpack.dev.conf.js
  - build: node build/build.js
  - lint: eslint --ext .js,.vue src
- 安装: vue vue-router axios element-ui --save
- 安装辅助插件: babel-core babel-loader copy-webpack-plugin css-loader style-loader file-loader html-webpack-plugin shelljs uglifyjs-webpack-plugin url-loader vue-loader webpack vue-style-loader vue-template-compiler webpack-bundle-analyzer webpack-dev-server --save-dev

##碰到的问题
- CLI被移动到了一个专门的包 webpack-cli里: cnpm install webpack-cli --save-dev
- Webpack has been initialised using a configuration object that does not match: loaders改为rules
- Cannot find module '@babel/core': babel-loader安装@7.1.5版本的不要用8
- vue-loader was used without the corresponding plugin: 
  - Vue-loader在15.*之后的版本都是 vue-loader的使用都是需要伴生 VueLoaderPlugin的
  - 在webpack配置中加: const VueLoaderPlugin = require('vue-loader/lib/plugin'); plugins中加 new VueLoaderPlugin()
  - The 'mode' option has not been set警告: webpack配置中加 mode: NODE_ENV === 'dev' ? 'development' : 'production'
  - Module not found: Error: Can't resolve '@/components/HelloWorld': 用11.1.4的vue-loader? 不用@ router下的index提出来
  - Cannot read property 'vue' of undefined: 
  - vue$和@的alias别名:'vue$': 'vue/dist/vue.esm.js','@': path.resolve(__dirname, '../src'),
- npm run dev可以npm run build不行: 改为 webpack --config xxx -p
- Module not found: Error: Can't resolve './assets/logo.png': 看代码发现是要加options: transformToRequire
- /logo.png和./asserts/logo.png 前面不回hash文件名,后面会而且有可能base64