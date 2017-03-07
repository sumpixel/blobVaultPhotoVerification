import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const schema = mongoose.Schema({
  address: String,
  id_photo: { data: Buffer, content_type: String },
  selfie_photo: { data: Buffer, content_type: String },
  accepted: Boolean,
  uploaded_date: { type: Date, default: Date.now },
});
const IdPhotoSchema = mongoose.model('IdPhoto', schema);

export default mongoose;
export { IdPhotoSchema };
