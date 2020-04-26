// 1.引入mongoose
import mongoose from 'mongoose'

// 4.创建资源Schema模式对象
let Schema = mongoose.Schema;
let sourceSchema = new Schema ({
    // 标题
    title: {type: String, required: true},
    // 作者
    author: {type: String, default: '杨志鹏'},
    // 缩略图
    small_img: {type: String,  required: true},
    // 是否收藏  0 不收藏 1 收藏
    is_store: {type: String, default: '0'},
    // 价格 0 免费
    price: {type: Number, default: 0},
    // 阅读次数
    read_count: {type: Number, default: 1},
    // 添加日期
    add_time: {type: Date, default: Date.now},
    // 文章内容
    content: {type: String, required: true},
    // 最后编辑时间
    l_time: {type: Date, default: Date.now}
});

// Model 对象
const sourceModel = mongoose.model('source', sourceSchema);

export default sourceModel;