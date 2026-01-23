const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  gender: { type: String, trim: true },
  dob: { type: String, trim: true },
  about: { type: String, trim: true },
  contactNumber: { type: String, trim: true },
  Image: {type: String,required: false,  trim: true,}
}, { timestamps: true });

module.exports = mongoose.models.Profile || mongoose.model('Profile', profileSchema);
