import express from 'express'
const router = express.Router();
import Source from '../models/Source'
import formidable from 'formidable'
import { basename } from 'path'
import config from '../src/config'

// *************************后台接口******************************

// 1.获取所有文章列表
// router.get('/back/source/api/list', (req, res, next) => {
//     Source.find({}, "_id title is_store price author", (err, docs) => {
//         if (err) {
//             return next(err);
//         }
//         // 数据返回
//         res.json({
//             status: 200,
//             result: docs
//         })
//     });
// })

// 图片上传到服务器
router.post('/back/source/api/add_img', (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadPath; //上传图片放置的文件夹
    form.keepExtensions = true; //保持文件的原始扩展名
    form.parse(req, (err, fields, files) => {
        if (err) {
            return next(err);
        }
        if (files.image_url) {
            // console.log(files);
            // console.log(files.image_url.path);
            let image_url = 'http://localhost:3000/uploads/' + basename(files.image_url.path);
            res.json({
                status: 200,
                result: image_url
            });
        } else {
            res.json({
                status: 1,
                result: '上传图片路径出现问题！'
            });
        }

    })
})

// 2.往数据库中插入一条数据
router.post('/back/source/api/add', (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadPath; //上传图片放置的文件夹
    form.keepExtensions = true; //保持文件的原始扩展名
    form.parse(req, (err, fields, files) => {
        if (err) {
            return next(err);
        }
        // 1.取出普通字符串
        let body = fields;
        // 2.解析上传的文件路径，取出文件名保存到数据库
        body.small_img = basename(files.small_img.path);
        // 3.操作数据库
        const source = new Source({
            title: body.title,
            author: body.author,
            small_img: body.small_img,
            price: body.price,
            content: body.content
        });

        source.save((err, result) => {
            if (err) {
                return next(err);
            }
            res.json({
                status: 200,
                result: '添加文章成功！'
            });
        })
    })
})

// 3.获取一条资源文章数据
router.get('/back/source/api/single/:sourceId', (req, res, next) => {
    Source.findById(req.params.sourceId, (err, docs) => {
        if (err) {
            console.log(err);
            return next(err);
        }
        // 返回数据
        res.json({
            status: 200,
            result: docs
        });
    });
});

// 4.根据id修改某资源文章数据
router.post('/back/source/api/edit', (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadPath;  // 上传图片放置的文件夹
    form.keepExtensions = true; // 保持文件的原始扩展名
    form.parse(req, (err, fields, files) => {
        if (err) {
            return next(err);
        }
        // 1. 取出普通字段
        let body = fields;
        // console.log(body);
        // 2. 根据id查询文档
        Source.findById(body.id, (err, source) => {
            if (err) {
                return next(err);
            }
            // 2.1 修改文档的内容
            source.title = body.title;
            source.author = body.author;
            source.small_img = body.small_img || basename(files.small_img.path);
            source.price = body.price;
            source.content = body.content;
            // 2.2 保存
            source.save((err, result) => {
                if (err) {
                    return next(err);
                }
                res.json({
                    status: 200,
                    result: '修改轮播图成功!'
                })
            });
        });
    });
});

// 5. 根据id删除一条资源文章
router.get('/back/source/api/remove/:sourceId', (req, res, next) => {
    let sourceId = req.params.sourceId;
    Source.deleteOne({ _id: sourceId }, (err, result) => {
        if (err) {
            return next(err);
        }
        res.json({
            status: 200,
            result: '删除资源文章成功！'
        })
    });
});

// 6.获取资源文章的总count
router.get('/back/source/api/count', (req, res, next) => {
    Source.countDocuments((err, count) => {
        if (err) {
            return next(err);
        }
        // console.log('count'+count);
        res.json({
            status: 200,
            result: count
        });
    });
})

// 7.获取资源列表数据
router.get('/back/source/api/list', (req, res, next) => {
    // 接收两个参数
    // 参数一：当前页面
    let page = Number.parseInt(req.query.page) || 1;
    // 参数二：每页显示的条数
    let pageSize = Number.parseInt(req.query.pageSize) || 3;
    // console.log('page'+page);
    // console.log('pageSize'+pageSize);
    // 根据计算，每次查找从(page-1)*pageSize开始
    // 操作数据库
    Source.find().skip((page - 1) * pageSize).limit(pageSize).exec((err, sources) => {
        if (err) {
            return next(err);
        }
        // console.log(sources);
        res.json({
            status: 200,
            result: sources
        })
    });
})


// *************************后台页面路由*****************************
// // 1. 查询数据库并渲染页面
// router.get('/back/source_list', (req, res, next) => {
//     Source.find((err, sources) => {
//         if(err) {
//             return next(err);
//         }
//         res.render('back/source_list.html', {sources});
//     });
// })

// 加载分页----方式一
// router.get('/back/source_list', (req, res, next) => {
//     // 接收两个参数
//     // 参数一：当前页面
//     let page = Number.parseInt(req.query.page) || 1;
//     // console.log(page);
//     // 参数二：每页显示的条数
//     let pageSize = Number.parseInt(req.query.pageSize) || 3;
//     // 根据计算，每次查找从(page-1)*pageSize开始
//     // 操作数据库
//     Source.find().skip((page-1)*pageSize).limit(pageSize).exec((err, sources) => {
//         if(err){
//             return next(err);
//         }
//         // 查询数据库中资源文章的总数量
//         Source.countDocuments((err, count) => {
//             if(err){
//                 return next(err);
//             }

//             // 计算总页数
//             let totalPage = Math.ceil(count / pageSize);
//             // console.log('count'+count);
//             // console.log('pageSize'+pageSize);
//             // console.log('总页数'+totalPage);
//             // 渲染资源文章列表页面
//             res.render('back/source_list.html', { sources, totalPage, page });
//         })
//     });

// })

// 加载分页----方式二(配合插件)
router.get('/back/source_list', (req, res, next) => {
    res.render('back/source_list.html');
})

// 2.添加幼教资源页面
router.get('/back/source_add', (req, res, next) => {
    res.render('back/source_add.html');
})

// 3.修改幼教资源页面
router.get('/back/source_edit', (req, res, next) => {
    res.render('back/source_edit.html');
})

export default router;