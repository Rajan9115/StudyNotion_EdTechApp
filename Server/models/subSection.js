const mongoose = require('mongoose');

const subSectionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  timeDuration: { type: String, trim: true },
  description: { type: String, trim: true },
  videoUrl: { type: String },
  additionalUrl: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.models.SubSection || mongoose.model('SubSection', subSectionSchema);
