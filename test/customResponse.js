class CustomResponse {
  constructor() {
    this.cookies = {};
    this.finished = false;
  }

  cookie(name,value) {
    this.cookies[name] = value;
  }

  end() {
    this.finished = true;
  }
}

module.exports = CustomResponse;
