class Conflict extends Error {
  status = 409;
  constructor(message) {
    super(message);
    this.name = "Conflict";
    this.data = null;
  }
}

module.exports = Conflict;
