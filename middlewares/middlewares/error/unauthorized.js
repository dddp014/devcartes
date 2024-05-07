class Unauthorized extends Error {
  status = 401;
  constructor(message) {
    super(message);
    this.name = "Unauthorized";
    this.data = null;
  }
}
module.exports = Unauthorized;
