import querystring from 'querystring';

// 主要用来解析post请求--表单提交的数据
export default (req, res, next) => {
  // 如果是get请求则过滤
  if (req.method.toLowerCase() === 'get') return next();
  // 如果是multipart/form-data, 过滤
  if (req.headers['content-type'].startsWith('multipart/form-data')) return next();
  // application/x-www-form-urlencoded需要处理
  // 数据拼接
  let data = '';
  req.on('data', (chunk) => {
    data += chunk
  });
  req.on('end', _ => {
    req.body = querystring.parse(data);
    next();
  });
};