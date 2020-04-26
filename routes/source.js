import express from 'express'
const router = express.Router();
import Source from '../models/Source'
import formidable from 'formidable'
import { basename } from 'path'
import config from '../src/config'

// *************************后台接口******************************

// 1.获取所有文章列表
router.get('/back/source/api/list', (req, res, next) => {
    Sowing.find({}, "_id title is_store price author", (err, docs) => {
        if (err) {
            return next(err);
        }
        // 数据返回
        res.json({
            status: 200,
            result: docs
        })
    });
})

// 图片上传到服务器
router.post('/back/source/api/add_img', (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadPath; //上传图片放置的文件夹
    form.keepExtensions = true; //保持文件的原始扩展名
    form.parse(req, (err, fields, files) => {
        if(err){
            return next(err);
        }
        if(files.image_url){
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
        if(err){
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
            if(err){
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
        if(err){
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
router.post('/back/source/api/edit', (req, res, next)=>{
    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadPath;  // 上传图片放置的文件夹
    form.keepExtensions = true; // 保持文件的原始扩展名
    form.parse(req, (err, fields, files)=>{
        if(err){
            return next(err);
        }
        // 1. 取出普通字段
        let body = fields;
        // console.log(body);
        // 2. 根据id查询文档
        Source.findById(body.id, (err, source)=>{
            if(err){
                return next(err);
            }
            // 2.1 修改文档的内容
            source.title = body.title;
            source.author = body.author;
            source.small_img = body.small_img || basename(files.small_img.path);
            source.price = body.price;
            source.content = body.content;
            // 2.2 保存
            source.save((err, result)=>{
                if(err){
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

// 5. 根据id删除一条轮播图
router.get('/back/source/api/remove/:sourceId', (req, res, next) => {
    let sourceId = req.params.sourceId;
    Source.deleteOne({_id: sourceId}, (err, result) =>{
        if(err){
            return next(err);
        }
        res.json({
            status: 200,
            result: '删除资源文章成功！'
        })
    });
});


// *************************后台页面路由*****************************
// 1. 查询数据库并渲染页面
router.get('/back/source_list', (req, res, next) => {
    Source.find((err, sources) => {
        if(err) {
            return next(err);
        }
        res.render('back/source_list.html', {sources});
    });
})
// 2.添加轮播图页面
router.get('/back/source_add', (req, res, next) => {
    res.render('back/source_add.html');
})

// 3.修改轮播图信息页面
router.get('/back/source_edit', (req, res, next) => {
    res.render('back/source_edit.html');
})

export default router;