class Forbidden extends Error {
  status = 403;
  constructor(message) {
    super(message);
    this.name = "Forbidden";
    this.data = null;
  }
}

module.exports = Forbidden;
