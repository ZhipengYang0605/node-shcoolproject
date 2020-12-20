import express from 'express';
import User from './../models/User';
import md5 from 'blueimp-md5';
import { basename, join } from 'path';
import formidable from 'formidable';
const router = express.Router();

const S_KEY = '@A951?.yang_+#';
const uploadFilePath = join(__dirname, '../public/uploads');
/* 注册管理员账户接口 */
router.post('/user/api/add', function (req, res, next) {
  const user_name = req.body.user_name || '';
  const user_pwd = md5(req.body.user_pwd + S_KEY) || '';
  // 判断用户是否存在
  User.findOne({ user_name: user_name }, (err, doc) => {
    if (err) return next(err);
    if (doc) {
      return res.json({
        status: 202,
        result: '账户已经存在'
      })
    }
    // 创建集合
    const user = new User({
      user_name: user_name,
      user_pwd: user_pwd
    });

    // 存储
    user.save((err, user) => {
      if (err) {
        return next(err);
      }
      res.json({
        status: 200,
        result: '添加管理员成功！'
      })
    })
  })
});

/* 登录接口 */
router.post('/user/api/login', (req, res, next) => {
  // 获取数据
  const user_name = req.body.user_name,
    user_pwd = md5(req.body.user_pwd + S_KEY);
  User.findOne({ user_name: user_name }, (err, user) => {
    if (err) return next(err);
    // 查询到了用户
    if (user) {
      // 密码匹配成功
      if (user.user_pwd === user_pwd) {
        // session中存入token
        req.session.token = user._id;
        // 返回登录成功的对象
        res.json({
          status: 200,
          result: {
            token: user._id,
            result: '登录成功！'
          }
        })
      } else {
        res.json({
          status: 1,
          result: '密码错误！'
        });
      }
    } else {
      res.json({
        status: 1,
        result: '用户不存在！'
      })
    }
  });
});

/* 退出登录 */
router.get('/back/user/api/logout', (req, res, next) => {
  req.session.cookie.maxAge = 0;
  res.json({
    status: 200,
    result: '退出登录成功！'
  })
});

/* 获取用户信息 ----部分*/
router.get('/back/user/api/u_msg/:token', (req, res, next) => {
  User.findById(req.params.token, '-_id icon_url real_name intro_self points rank gold', (err, user) => {
    if (err) return next(err);
    if (user) {
      res.json({
        status: 200,
        result: user
      });
    } else {
      // 获取失败，清除session
      req.session.cookie.maxAge = 0;
    }
  })
});

/* 获取用户所有信息 */
router.get('/back/user/api/u_msg_all/:token', (req, res, next) => {
  User.findById(req.params.token, '-_id -user_name -user_pwd -l_edit -c_time', (err, user) => {
    if (err) return next(err);
    if (user) {
      res.json({
        status: 200,
        result: user
      });
    } else {
      req.session.cookie.maxAge = 0;
    }
  })
});

/* 根据ID编辑用户信息 */
router.post('/back/user/api/edit', (req, res, next) => {
  const form = new formidable.IncomingForm();
  // 上传图片的文件夹
  form.uploadDir = uploadFilePath;
  // 保持文件的原始扩展名
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) return next(err);
    // 取出普通字段
    let body = fields;
    console.log(body.token);
    // 根据id查询文档
    console.log()
    User.findById(body.token, (err, user) => {
      if (err) return next(err);
      // 修改文档内容
      user.real_name = body.real_name;
      user.icon_url = body.icon_url || basename(files.icon_url.path);
      user.phone = body.phone;
      user.e_mail = body.e_mail;
      user.join_time = body.join_time;
      user.intro_self = body.intro_self;
      // 保存
      user.save((err, result) => {
        if (err) return next(err);
        res.json({
          status: 200,
          result: '用户信息修改成功！'
        });
      });
    })
  })
});

/* 修改密码 */
router.post('/back/user/api/reset', (req, res, next) => {
  const token = req.body.token,
    old_pwd = md5(req.body.old_pwd + S_KEY),
    new_pwd = md5(req.body.new_pwd + S_KEY);
  User.findById(token, (err, user) => {
    if (err) return next(err);
    // 查询到了用户
    if (user) {
      // 输入密码错误
      if (old_pwd !== user.user_pwd) return res.json({ status: 1, result: '输入密码错误！' });
      user.user_pwd = new_pwd
      user.save((err, result) => {
        if (err) return next(err);
        res.json({
          status: 200,
          result: '修改密码成功！'
        });
      });
    } else {
      // 没有找到用户
      req.session.cookie.maxAge = 0;
      res.json({
        status: 1,
        result: '非法用户！'
      });
    }
  })
});

/*  */
export default router;