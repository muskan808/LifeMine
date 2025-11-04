const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  street: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  zipcode: { type: String, required: true, trim: true },
});

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 50 },
  username: { type: String, required: true, minlength: 3, maxlength: 20 },
  email: { type: String, required: true, maxlength: 100 },
  phone: { type: String, maxlength: 20 },
  website: { type: String, maxlength: 100 },
  isActive: { type: Boolean, default: true },
  skills: [{ type: String }],
  availableSlots: [{ type: Date }],
  address: { type: AddressSchema, required: true },
  company: { type: CompanySchema, required: true },
  role: { type: String, enum: ['Admin', 'Editor', 'Viewer'], default: 'Viewer' },
}, { timestamps: true });

// expose `id` as string
UserSchema.method('toJSON', function() {
  const obj = this.toObject({ virtuals: true });
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
});

module.exports = mongoose.model('User', UserSchema);
