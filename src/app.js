import express from 'express'
import config from './config.js'
import nunjucks from 'nunjucks'
// 引入session
import session from 'express-session'
import routerIndex from './../routes/index'
import bodyParser from './../middle_mares/body_parser'
import userParser from './../middle_mares/user_parser'
import routerSowing from './../routes/sowing'
import routerSource from './../routes/source'
import errorLog from './../middle_mares/error_log'
import routerUser from './../routes/user'

const app = express();
// 引入connect-mongo用于express连接数据库存储session
const mongoStore  = require('connect-mongo')(session);

// 使用session
app.use(session({
    secret: 'schollproject',//加密字符串
    name: 'school_project',//返回客户端key的名称，默认为connect_sid
    resave: false,//强制保存session，即使它没有变化
    saveUninitialized: true,//强制将未初始化的session存储。当新建一个session且未设定属性或值时，它就处于未初始化状态。在设定cookie前，这对于登录验证，减轻服务器存储压力，权限控制是有帮助的，默认为true
    cookie: {
        maxAge: 1800000
    },
    rolling: true,//在每次请求时进行设置cookie，将重置cookie过期时间
    store: new mongoStore({//将session数据存储到mongo数据库中
        url: 'mongodb://127.0.0.1/school',//数据库地址
        touchAfter: 24*3600 //多长时间往数据库中更新存储一次，除了在会话数据上更改了某些数据除外
    })
}));

// 1.加载静态资源文件
app.use(express.static(config.publicPath));

// 2.配置nunjucks
nunjucks.configure(config.viewsPath, {
    // autoescape: true,
    express: app,
    noCache: true //不使用缓存
});

// 配置数据处理的中间件
app.use(bodyParser);
app.use(userParser); //处理权限的中间件
// 3.挂载路由
app.use(routerIndex);
app.use(routerSowing);
app.use(routerSource);
app.use(routerUser);

// 5.配置Error日志
app.use(errorLog);

// 4.配置404页面
app.use((req, res) => {
    res.render('404.html');
});

app.listen(3000, ()=>{
    console.log('服务器已启动！');
})