import mongoose from 'mongoose';

const sowingSchema = mongoose.Schema({
  // 图片名称
  image_title: { type: String, required: true },
  // 图片地址
  image_url: { type: String, required: true },
  // 跳转地址
  image_link: { type: String, required: true },
  // 上架时间
  s_time: { type: String, required: true },
  // 下架时间
  e_time: { type: String, required: true },
  // 最后编辑时间
  l_edit: { type: Date, required: true },
  // 添加时间
  c_time: { type: Date, required: true }
});

const Sowing = mongoose.model('Sowing', sowingSchema);
export default Sowing;