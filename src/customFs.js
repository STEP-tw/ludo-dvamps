class CustomFs {
  constructor() {
    this.files = {};
  }
  existsSync(fileName) {
    return this.files[fileName] != undefined;
  }
  addFile(fileName,content){
    this.files[fileName]=content;
  }
  readFileSync(fileName, encoding) {
    if (!this.existsSync(fileName)) {
      throw new Error('file not found');
    }
    return this.files[fileName];
  }
  writeFileSync(fileName, data) {
    if (!this.existsSync(fileName)) {
      throw new Error('file not found');
    }
    this.files[fileName] = data;
    return data;
  }
}
module.exports = CustomFs;
