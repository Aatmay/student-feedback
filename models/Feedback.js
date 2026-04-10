const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: [true, "Student name is required"]
  },
  courseName: {
    type: String,
    required: [true, "Course name is required"]
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot exceed 5"]
  },
  comments: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;