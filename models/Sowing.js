// 1.引入mongoose
import mongoose from 'mongoose'
// 2.连接数据库
mongoose.connect('mongodb://localhost:27017/school', {useNewUrlParser: true, useUnifiedTopology: true});
// 3.监听数据库
mongoose.connection.on('open', () => { // 连接成功
    console.log('连接数据库成功！');
});

mongoose.connection.on('error', ()=> { // 连接失败

});

// 4.创建轮播图Schema模式对象
let Schema = mongoose.Schema;
let sowingSchema = new Schema ({
    // 图片名称
    image_title: {type: String, required: true},
    // 图片地址
    image_url: {type: String, required: true},
    // 跳转链接
    image_link: {type: String, required: true},
    // 上架时间
    s_time: {type: String, required: true},
    // 下架时间
    e_time: {type: String, required: true},
    // 最后编辑
    l_edit: {type: Date, default: Date.now()},
    // 添加时间
    c_time: {type: Date, default: Date.now()}
});

// Model 对象
const sowingModel = mongoose.model('sowing', sowingSchema);

export default sowingModel;