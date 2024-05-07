// error
const BadRequest = require("./error/BadRequest"); // 400 error
const Unauthorized = require("./error/Unauthorized"); // 401 error
const Forbidden = require("./error/Forbidden"); // 403 error
const NotFound = require("./error/NotFound"); // 404 error
const Conflict = require("./error/Conflict"); // 409 error

// user
const Identification = require("./user/identification");

module.exports = {
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  Conflict,
  Identification,
};
