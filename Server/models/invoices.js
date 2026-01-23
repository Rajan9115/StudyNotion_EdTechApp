const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  Users: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  courseName: { type: String, trim: true },
  price: { type: String, trim: true },
  address: { type: String, trim: true },
  pincode: { type: String, trim: true },
  courseID: { type: mongoose.Schema.Types.ObjectId, ref: 'Courses' }
}, { timestamps: true });

module.exports = mongoose.model('Invoices', invoiceSchema);
