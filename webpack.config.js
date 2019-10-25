'use strict';
const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

//会编译的html文件后缀
const htmlExtensions = ['.html','.htm','.tpl'];

const host = {
    dev:'',
    dis:''
};

//目录配置
const paths = {
    root:{
        //开发环境输出根目录
        dev:path.resolve(__dirname, './output/dev'),
        //生产环境输出根目录
        dis:path.resolve(__dirname, './output/dis'),
        //源码文件根目录
        src:path.resolve(__dirname, './src')
    },
    outpath:{
        //输出的js文件目录
        js:'static/',
        //输出的图片文件目录
        img:'static/images/',
        //输出的字体文件目录
        font:'static/fonts/',
        //输出的css文件目录
        css:'static/css/',
    }
};

module.exports = function (env, argv) {
    let mode = 'development';
    let development = true;
    if (typeof env === 'object' && env.hasOwnProperty('production') && env.production === true) {
        mode = 'production';
        development = false;
    }
    let publicPath = development?host.dev:host.dis;
    let webpackConfig = {
        // mode: 'none',//"production" | "development" | "none"
        mode: mode,
        entry: {},//具体内容由后面编写的脚本填充
        output: {
            //输出文件根目录，绝对路径
            path: development?paths.root.dev:paths.root.dis,

            //输出文件名
            filename: paths.outpath.js+'[name].js',

            //sourcemap输出文件名
            //[file]:生成后的js文件名（包括路径）,[filebase]:生成后的js文件名（不包括路径）
            sourceMapFilename: '[file].map',

            //chunk文件输出文件名
            chunkFilename:paths.outpath.js+'common.[id].js',

            // publicPath: 相对目录，可以使用cdn地址（开发环境不设置等）
            publicPath:publicPath
        },
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js' // 用 webpack 1 时需用 'vue/dist/vue.common.js'
            }
        },
        //优化选项
        optimization:{
            splitChunks:{
                cacheGroups:{
                    //公共模块配置
                    commons:{
                        //对导入方式的设置，'async':只管动态导入的，'initial':只管静态导入的，'all':所有的
                        //静态导入：import 'xxx',动态导入：import('xxx')
                        chunks: 'all',
                        //有2个chunk使用才切分到公共文件中
                        minChunks:10,
                        //最大并发数，简单理解为一个entry及包含的文件最多被拆分成多少个chunk
                        maxInitialRequests:5,
                        //0以上的大小就会切分chunk
                        minSize:0,
                        // name:'[chunkhash]'//影响文件名、sourcemap文件名、其他地方引用的chunk的name
                        // filename:paths.outpath.js+'common.js'
                    },
                    vendor:{
                        test:/[\\/]node_modules[\\/]/i,
                        chunks:'all',
                        priority:10,
                        enforce:true
                    }
                }
            }
        },
        module: {
            rules: [
                {
                    //对ES6语法进行编译
                    test: /\.js$/i,
                    exclude:/[\\/]node_modules[\\/]/i,
                    loader:'babel-loader',
                    options:{
                        presets:['@babel/preset-env']
                    }
                },
                {
                    //css文件的处理
                    test: /\.(css|scss)$/i,
                    use : [
                        //使用插件将css文件提取为单独的文件
                        MiniCssExtractPlugin.loader,

                        //css解析需要的配置
                        'css-loader',

                        // 处理CSS压缩、@import等需要的配置
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    require('postcss-import')(),
                                    //自动添加fixer（比如--webkit-等）
                                    require('autoprefixer')({
                                        browsers: ['last 30 versions', "> 2%", "Firefox >= 10", "ie 6-11"]
                                    })
                                ]
                            }
                        },

                        //处理sass
                        'sass-loader',
                    ]
                },
                {
                    //css中图片的处理
                    test: /\.(png|svg|jpg|gif)$/i,
                    use:[
                        {
                            //使用urlloader将图片自动转换成base64/文件
                            loader:'url-loader',
                            options:{
                                //文件名
                                name:paths.outpath.img+'[name].[ext]',

                                //单独的publicpath
                                publicPath:publicPath,
                                // outputPath:path.resolve(__dirname, development?'./output/dev':'./output/dis'),

                                //base64/文件的文件大小界限（K）
                                limit:200
                            }
                        }
                    ]
                },
                {
                    test:/\.(woff|woff2|eot|ttf|otf|svg)$/i,
                    use:[
                        {
                            loader:'file-loader',
                            options:{
                                name:paths.outpath.font+'/[name].[ext]',
                                publicPath:publicPath,
                                limit: 0
                            }
                        }
                    ]
                },
                {
                    //处理html文件中的资源文件，比如图片，提取后匹配上面的图片test，然后由urlloader处理
                    test:/\.(html)$/i,
                    use:['html-withimg-loader']
                }
            ]
        },
        plugins: [
            //css单独打包插件
            new MiniCssExtractPlugin({filename:paths.outpath.css+'/[id].css'}),

            //打包前用于清空 output 目录
            new WebpackCleanupPlugin(),
        ],
        // devtool 更详细的资料：https://segmentfault.com/a/1190000008315937
        devtool: development ? 'inline-cheap-module-source-map' : false
    };
    if (!development) {
        //生产模式配置CSS压缩
        webpackConfig.plugins.push(new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            // cssProcessorOptions: cssnanoOptions,
            cssProcessorPluginOptions: {
                preset: ['default', {
                    discardComments: {
                        removeAll: true,
                    },
                    normalizeUnicode: false
                }]
            },
            canPrint: true
        }));
    }

    webpackConfig.entry["index"] = "./src/js/index.js";
    webpackConfig.entry["worker"] = "./src/js/worker.js";
    webpackConfig.plugins.push(new HtmlWebpackPlugin({
        //输出文件名
        filename: "index.html",

        //模板文件（源文件）
        template: "./src/index.html",

        //插入的内容在哪里（true|'head'|'body'|false）
        inject: true,

        //是否闭合link标签(xhtml标准)
        xhtml: true,

        //在插入的js、css标签后面加上hash
        hash: true,

        //这个html文件中插入的chunks，3.x版本的插件不能处理common chunk，4.x版本可以自动处理
        chunks: ["index"]
    }));
    webpackConfig.entry["quest"] = "./src/js/quest.js";
    webpackConfig.plugins.push(new HtmlWebpackPlugin({
        //输出文件名
        filename: "quest.html",

        //模板文件（源文件）
        template: "./src/quest.html",

        //插入的内容在哪里（true|'head'|'body'|false）
        inject: true,

        //是否闭合link标签(xhtml标准)
        xhtml: true,

        //在插入的js、css标签后面加上hash
        hash: true,

        //这个html文件中插入的chunks，3.x版本的插件不能处理common chunk，4.x版本可以自动处理
        chunks: ["quest"]
    }));

    return webpackConfig;
};