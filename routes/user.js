import express from 'express'
import User from './../models/User'
import md5 from 'md5'
import formidable from 'formidable'
import config from './../src/config'
import {basename} from 'path'
const router = express.Router()
const S_KEY = '@.$1%a*_'

// =================1.用户数据接口===================
// 1.1 生成后台管理员
router.post('/user/api/add', (req, res, next) => {
    let user_name = req.body.user_name;
    let user_pwd = md5(req.body.user_pwd + S_KEY);
    // 操作数据库
    const user = new User({
        // 用户名
        user_name: user_name,
        user_pwd: user_pwd
    });

    // 存储
    user.save((err, result) => {
        if (err) {
            return next(err);
        }
        res.json({
            status: 200,
            result: '创建管理员成功！'
        });
    })
});

// 1.2 管理员登录接口
router.post('/user/api/login', (req, res, next) => {
    // 1.2.1. 获取数据
    let user_name = req.body.user_name;
    let user_pwd = req.body.user_pwd;
    // 1.2.2 根据name查找数据库
    User.findOne({user_name: user_name}, (err, user) => {
        if(err) {
            return next(err);
        }
        // 判断用户是否存在
        if(user){
            // 判断密码是否正确
            if(user.user_pwd === user_pwd){ //登陆成功
                // 在session中存储客户端的信息
                req.session.token = user._id;
                res.json({
                    status: 200,
                    result: {
                        token: user._id,
                        message: '登录成功！'
                    }
                });

            } else {
                res.json({
                    status: 1,
                    result: '输入密码有误！'
                })
            }
        } else {
            res.json({
                status: 1,
                result: '用户不存在！'
            })
        }
    });
});

// 1.3 用户退出接口
router.get('/back/user/api/logout', (req, res, next) => {
    // 销毁session
    // 方式一
    req.session.cookie.maxAge = 0;
    // 方式二
    /*
    req.session.destory((err) => {
        return next(err);
    })
    */
    // 提示用户
    res.json({
        status: 200,
        result: '退出登录成功！'
    });
});
// 1.4 获取用户部分信息
router.get('/back/user/api/u_msg/:token', (req, res, next) => {
    User.findById(req.params.token, '-_id icon_url real_name intro_self points rank gold', (err, user) => {
        if (err) {
            return next(err);
        }
        if (user) {
            res.json ({
                status: 200,
                result: user
            }) 
        } else {
            req.session.cookie.maxAge = 0;
        }
    });
});

// 1.5 获取用户所有信息
router.get('/back/user/api/u_msg_all/:token', (req, res, next) => {
    User.findById(req.params.token, '-_id -user_name -user_pwd -l_edit -c_time', (err, user) => {
        if (err) {
            return next(err);
        }
        if (user) {
            res.json ({
                status: 200,
                result: user
            })
        } else {
            req.session.cookie.maxAge = 0;
        }
    });
})

// 1.6 修改用户所有信息
router.post('/back/user/api/edit', (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadPath; //上传图片放置的文件夹
    form.keepExtensions = true; //保持文件原始的扩展名
    form.parse(req, (err, fields, files) => {
        if (err) {
            return next(err);
        }
        // 取出普通字符串
        let body = fields;
        // 4.1 查找
        User.findById(body.token, (err, user) => {
            if (err) {
                return next(err);
            }
            // 4.2 修改
            user.real_name = body.real_name;
            user.icon_url = body.icon_url || basename(files.icon_url.path);

            user.phone = body.phone;
            user.e_mail = body.e_mail;
            user.join_time = body.join_time;
            user.intro_self = body.intro_self;

            // 4.3 保存
            user.save((err, result) => {
                if (err) {
                    return next(err);
                }
                res.json({
                    status: 200,
                    result: '修改用户信息成功！'
                });
            });

        });
    });
});

// 1.7 修改用户登录密码
router.post('/back/user/api/reset', (req, res, next) => {
    // 1.获取数据
    const token = req.body.token;
    const old_pwd = req.body.old_pwd;
    const new_pwd = req.body.new_pwd;
    // 2.根据token查询用户
    User.findById(token, (err, user) => {
        if(err) {
            return next(err);
        }
        if(user) { // 查询到了
            if(user.user_pwd !== old_pwd) { //输入旧密码错误
                res.json({
                    status: 1,
                    result: '密码错误！'
                });
            }
            // 查询到了且输入旧密码与数据库中的密码一致
            user.user_pwd = new_pwd;
            // 保存到数据库
            user.save((err, result) => {
                if(err){
                    return next(err);
                }
                res.json({
                    status: 200,
                    result: '修改密码成功！'
                });
            })
        } else {
            res.json({
                status: 1,
                result: '非法用户！'
            })
        }
    });
});




// =================2.后台用户页面路由===================
// 2.1 登录页面
router.get('/back/login', (req, res, next) => {
    res.render('back/login.html');
});

// 2.2 用户中心页面
router.get('/back/u_center', (req, res, next) => {
    res.render('back/user_center.html');
});

// 2.3 用户中心信息编辑页面
router.get('/back/u_set', (req, res, next) => {
    res.render('back/user_message.html');
});

// 2.4 忘记密码页面
router.get('/back/u_reset_pwd', (req, res, next) => {
    res.render('back/reset_pwd.html');
});

export default router;