import express from 'express'
const router = express.Router();
import Sowing from './../models/Sowing'

// 1.后台页面路由
router.get('/back', (req, res) => {
    res.render('back/index.html');
});

// 2.前端路由
// 2.1 重定向到web首页
router.get('/', (req, res)=>{
    res.redirect('/web'); // 重定向到web首页
});

// 2.2前端web首页
router.get('/web', (req, res) => {
    res.render('web/index.html');
});

// 2.3 web幼教资源页面&&加载sowing图片
router.get('/web/res', (req, res) => {
    Sowing.find({}, '-_id image_title image_url image_link', (err, sowings) => {
        if (err) {
            return next(err);
        }
        let tag = ['one', 'two', 'three', 'four'];
        for (let i = 0; i < tag.length; i++) {
            let sowing = sowings[i];
            sowing['image_tag'] = tag[i];
        }
        res.render('web/resources.html', {sowings});
    });
});

// 2.4 web幼教资源正文页面
router.get('/web/res_c', (req, res) => {
    res.render('web/resources_content.html');
});

export default router;