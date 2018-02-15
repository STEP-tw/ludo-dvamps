class CustomResponse {
  constructor() {
    this.cookies = {};
  }

  cookie(name,value) {
    this.cookies[name] = value;
  }
}

module.exports = CustomResponse;
