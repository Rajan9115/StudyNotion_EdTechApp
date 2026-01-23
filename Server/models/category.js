const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  Name: { type: String, required: true, trim: true },
  Description: { type: String, trim: true },
  Courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Courses' }]
}, { timestamps: true });

module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema);
