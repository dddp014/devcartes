const { Schema } = require("mongoose");

const LikeSchema = new Schema({
  fromUser: {
    // Like 누르는 유저
    type: [String],
    required: true,
    default: [],
  },
  boardId: {
    type: Number,
    required: true,
  },
});

module.exports = LikeSchema;
