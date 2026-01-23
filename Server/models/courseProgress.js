const mongoose = require('mongoose');

const courseProgressSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Courses', required: true },
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  completedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubSection' }]
}, { timestamps: true });

module.exports = mongoose.models.CourseProgress || mongoose.model('CourseProgress', courseProgressSchema);
