import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String },
  country: { type: String },
  phone: { type: String },
}, { timestamps: true });

const Address = mongoose.models.address || mongoose.model('address', addressSchema);

export default Address; 