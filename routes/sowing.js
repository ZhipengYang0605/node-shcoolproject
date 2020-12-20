import express from 'express';
import Sowing from './../models/Sowing';
import { basename } from 'path';
import formidable from 'formidable';
import SowingController from './../controller/sowing/SowingController';
const router = express.Router();

/* 后端接口 */
// 1.添加轮播图
// router.post('/back/sowing/api/add', SowingController.insertOneSowing);


/* 前端接口 */