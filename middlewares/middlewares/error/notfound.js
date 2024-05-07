class NotFound extends Error {
  status = 404;
  constructor(message) {
    super(message);
    this.name = "NotFound";
    this.data = null;
  }
}

module.exports = NotFound;
