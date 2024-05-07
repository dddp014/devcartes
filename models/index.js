const mongoose = require("mongoose");
const UserSchema = require("./schemas/user");
const EducationSchema = require("./schemas/education");
const AwardSchema = require("./schemas/award");
const ProjectSchema = require("./schemas/project");
const CertificateSchema = require("./schemas/certificate");
const CounterSchema = require("./schemas/counter");
const BoardSchema = require("./schemas/board");

exports.User = mongoose.model("User", UserSchema);
exports.Education = mongoose.model("Education", EducationSchema);
exports.Award = mongoose.model("Award", AwardSchema);
exports.Project = mongoose.model("Project", ProjectSchema);
exports.Certificate = mongoose.model("Certificate", CertificateSchema);
exports.Counter = mongoose.model("Counter", CounterSchema);
exports.Board = mongoose.model("Board", BoardSchema);
