import express from 'express'
const router = express.Router();
import Sowing from '../models/Sowing'
import formidable from 'formidable'
import { basename } from 'path'
import config from './../src/config'

// *************************后台接口******************************

// 1.获取所有轮播图列表
router.get('/back/sowing/api/list', (req, res, next) => {
    Sowing.find({}, "_id image_title image_url image_link s_time e_time", (err, docs) => {
        if (err) {
            return next(err);
        }
        // 数据返回
        res.json({
            status: 200,
            result: docs
        })
    });
});

// 2.往数据库中插入一条数据
router.post('/back/sowing/api/add', (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadPath; // 上传图片放置的文件夹
    form.keepExtensions = true; //保持文件的原始扩展名
    form.parse(req, (err, fields, files) => {
        if (err) {
            return next(err);
        }
        //  2.1 取出普通字段
        let body = fields;
        // 2.2 解析上传的文件路径， 取出文件名保存到数据库
        body.image_url = basename(files.image_url.path);
        // 2.3 操作数据库
        const sowing = new Sowing({
            // 图片名称
            image_title: body.image_title,
            // 图片地址
            image_url: body.image_url,
            // 跳转链接
            image_link: body.image_link,
            // 上架时间
            s_time: body.s_time,
            // 下架时间
            e_time: body.e_time,
        });
        // 2.4 保存
        sowing.save((err, result) => {
            if (err) {
                return next(err);
            };
            res.json({
                status: 200,
                result: '添加轮播图成功！'
            });
        });
    });
});

// 3.获取一条轮播图数据
router.get('/back/sowing/api/single/:sowingId', (req, res, next) => {
    Sowing.findById(req.params.sowingId, "_id image_title image_url image_link s_time e_time", (err, docs) => {
        if (err) {
            return next(err);
        }
        // 返回数据
        res.json({
            status: 200,
            result: docs
        });
    });
})

// 4.根据id修改某条轮播图数据
router.post('/back/sowing/api/edit', (req, res, next) => {
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
        Sowing.findById(body.id, (err, sowing) => {
            if (err) {
                return next(err);
            }
            // 4.2 修改
            sowing.image_title = body.image_title;
            sowing.image_url = body.image_url || basename(files.image_url.path);
            sowing.image_link = body.image_link;
            sowing.s_time = body.s_time;
            sowing.e_time = body.e_time;

            // 4.3 保存
            sowing.save((err, result) => {
                if (err) {
                    return next(err);
                }
                res.json({
                    status: 200,
                    result: '修改数据成功！'
                })
            });

        });
    });
});

// 5. 根据id删除一条轮播图
router.get('/back/sowing/api/remove/:sowingId', (req, res, next) => {
    Sowing.deleteOne({ _id: req.params.sowingId }, (err, result) => {
        if (err) {
            return next(err);
        }
        res.json({
            status: 200,
            result: '成功删除轮播图！'
        });
    });
});


// *************************后台页面路由*****************************
// 1. 查询数据库并渲染页面
router.get('/back/s_list', (req, res, next) => {
    // 查询数据库所有数据
    Sowing.find((err, sowings) => {
        if (err) {
            return next(err);
        }
        res.render('back/sowing_list.html', { sowings });
    });
});

// 2.添加轮播图页面
router.get('/back/s_add', (req, res, next) => {
    res.render('back/sowing_add.html');
});

// 3.修改轮播图信息页面
router.get('/back/s_edit', (req, res, next) => {
    res.render('back/sowing_edit.html');
});

export default router;