const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true, trim: true },
  courseDescription: { type: String, trim: true },
  Instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  WhatYouWillLearn: { type: String, trim: true },
  courseContent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],
  RatingandReviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RatingandReviews' }],
  price: { type: Number, required: true, min: 0 },
  thumbnail: { type: String, trim: true },
  tags:{type: [String]},
  Category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  StudentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
  instructions: { type: [String], trim: true },
  status: { type: String, enum: ['Draft', 'Published', 'Archived'] },
}, { timestamps: true });

module.exports = mongoose.models.Courses || mongoose.model("Courses", courseSchema);
