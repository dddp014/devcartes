const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const AwardSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  acqDate: {
    type: String,
    required: true,
  },
});

AwardSchema.plugin(AutoIncrement, {
  id: "award_sequence",
  reference_fields: "userId",
  inc_field: "awardId",
});

module.exports = AwardSchema;
