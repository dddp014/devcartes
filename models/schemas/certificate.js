const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const CertificateSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  acqDate: {
    type: String,
    required: true,
  },
});

CertificateSchema.plugin(AutoIncrement, {
  id: "certificate_sequence",
  reference_fields: "userId",
  inc_field: "certificateId",
});

module.exports = CertificateSchema;
