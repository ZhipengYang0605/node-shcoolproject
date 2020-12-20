import mongoose from 'mongoose';

// 创建管理员（用户）模式对象
const userSchema = mongoose.Schema({
  // 姓名
  real_name: { type: String, required: true, default: 'zeke_young' },
  // 用户名
  user_name: { type: String, required: true },
  // 密码
  user_pwd: { type: String, required: true },
  // 头像
  icon_url: { type: String, required: false },
  // 手机号码
  phone: { type: String, required: false },
  // 邮箱
  e_mail: { type: String, required: false },
  // 加入日期
  join_time: { type: String, required: false },
  // 自我介绍
  intro_self: { type: String, default: '我是杨志鹏啊' },
  // 积分
  points: { type: Number, default: 100 },
  // 等级
  rank: { type: Number, default: 1 },
  // 金币
  gold: { type: Number, default: 0 },
  // 当前编辑的时间
  l_edit: { type: Date, default: Date.now() },
  // 添加时间
  c_time: { type: Date, default: Date.now() },
});

const User = mongoose.model('user', userSchema);
export default User;