const { Schema } = require("mongoose");

const EducationSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  educationId: {
    type: Number,
    required: true,
    default: 0,
  },
  schoolName: {
    type: String,
    required: true,
  },
  major: {
    type: String,
    required: true,
  },
  schoolState: {
    type: String,
    // enum: ["재학중", "학사졸업", "석사졸업", "박사졸업"],
    required: true,
  },
});

module.exports = EducationSchema;
