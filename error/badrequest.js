class BadRequest extends Error {
  status = 400;
  constructor(message) {
    super(message);
    this.name = "BadRequest";
    this.data = null;
  }
}

module.exports = BadRequest;
