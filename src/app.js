import express from 'express';
const app = express();

// 引入自定义中间件
import bodyParser from './../middle_wares/body_parser.js';
import errorLog from './../middle_wares/error_log.js';
import loginPass from './../middle_wares/login_pass.js';

// 引入路由
import sowingRouter from './../routes/sowing';
import userRouter from './../routes/user';

// 连接数据库
import './../db/db.js';

// 配置静态资源存放路径
app.use(express.static(__dirname + '/public'));

// 引入express-session
import session from 'express-session';

// connect-mongo用于express连接数据库存储session
const mongoStore = require('connect-mongo')(session);

// 使用session
app.use(session({
  secret: 'keybord cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1800000 },
  rolling: true,
  store: new mongoStore({
    url: 'mongodb://localhost:27017/school',
    touchAfter: 1800000
  })
}));

// 配置数据处理中间件
app.use(bodyParser);

// 后端登录拦截
// app.use(loginPass);

// 路由中间件
app.use(userRouter);

// 挂载路由
// app.use(sowingRouter);

// 抛出异常中间件
app.use(errorLog);

// 监听启用3000端口号
app.listen(3000, _ => {
  console.log('Server was ruunning at localhost: 3000!')
});