const mongoose = require('mongoose');

const ratingAndReviewsSchema = new mongoose.Schema({
  user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    rating: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Courses",
      index: true,
    },
  }, { timestamps: true });

  ratingAndReviewsSchema.index({ course: 1, user: 1 }, { unique: true });

module.exports = mongoose.models.RatingandReviews || mongoose.model('RatingandReviews', ratingAndReviewsSchema);
