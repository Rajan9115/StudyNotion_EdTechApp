const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  FirstName: { type: String, required: true, trim: true },
  LastName: { type: String, required: true, trim: true },
  Email: { type: String, required: true, trim: true, unique: true },
  Password: { type: String, required: true },
  AccountType: { type: String, required: true, enum: ['Student', 'Instructor', 'Admin'], default: 'Student' },
  Token: { type: String },
  TokenExpiry: { type: Date },
//   Active: { type: Boolean, default: true },
//   Approve: { type: Boolean, default: false },
  Courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Courses' }],
  AdditionalDetails: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
  CourseProgress: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CourseProgress' }],


}, { timestamps: true });

module.exports = mongoose.models.Users || mongoose.model('Users', userSchema);
