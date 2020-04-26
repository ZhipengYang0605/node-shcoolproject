export default (req, res, next) => {
    // // 1. 过滤所有非后端请求
    if(req.path.indexOf('/back') === -1) {
        return next();
    }

    // // 2.判断是否是处于有效登录时效
    if(req.session.token) {
        return next();
    }

    // // 3. 处理没有登录/登录失效
    // // 3.1 请求接口
    if(req.path.indexOf('api') !== -1) {
        return next(new Error('非法访问！'));
    }
    
    // // 3.2 请求后台页面
    res.render('back/login.html');
    // next();
}