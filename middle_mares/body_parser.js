import querystring from 'querystring'

// 处理post请求
export default (req, res, next) => {
    // 1.过滤get请求
    if (req.method.toLowerCase() === 'get') {
        return next();
    }
    // 2. 文件（图片/音视频等），不处理
    //multipart/form-data   startsWith
    if (req.headers['content-type'].startsWith('multipart/form-data')) {
        return next();
    }
    // 3.普通表单提交要处理---数据流拼接
    //application/x-www-form-urlencoded
    let data = '';
    req.on('data', (chunck) => {
        data += chunck;
    });

    req.on('end', () => {
        req.body = querystring.parse(data);
        next();
    });

}