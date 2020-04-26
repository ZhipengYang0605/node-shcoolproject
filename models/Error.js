// 1.引入mongoose
import mongoose from 'mongoose'

// 2.创建Error日志Schema模式对象
let errorSchema = mongoose.Schema({
    // 错误名称
    error_name: {type: String, required: true},
    // 错误消息
    error_message: {type: String, required: true},
    // 错误堆栈
    error_stack: {type: String, required: true},
    // 错误发生时间
    error_time: {type: Date, default: Date.now()}
});

// Model 对象
const errorModel = mongoose.model('error', errorSchema);

export default errorModel;