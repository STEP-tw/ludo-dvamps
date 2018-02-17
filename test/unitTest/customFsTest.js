const assert = require('chai').assert;
const path = require('path');
const MockFs = require(path.resolve('src/customFs.js'));


describe('mockFs', () => {
  var mockFs;
  beforeEach(() => {
    mockFs = new MockFs();
  })

  describe('#addFile()', () => {
    it('should add file', () => {
      mockFs.addFile('good','something');
      assert.include(mockFs.files, {
        'good': 'something'
      });
    })
  })

  describe('#existsSync()', () => {
    it('should check whether file exists or not', () => {
      mockFs.addFile('good','something');
      assert.ok(mockFs.existsSync('good'));
      assert.notOk(mockFs.existsSync('bad'));
    })
  })

  describe('#readFileSync()', () => {
    it('should return the file content if file exists', () => {
      mockFs.addFile('good','something');
      assert.equal(mockFs.readFileSync('good'), 'something');
    })
    it('should throw error if file does not exists', () => {
      assert.throws(() => {
        mockFs.readFileSync('good')
      }, 'file not found');
    })
  })

  describe('#writeFileSync()', () => {
    it('should write the given content to file if file exists', () => {
      mockFs.addFile('good','something');
      mockFs.writeFileSync('good', 'fileContent')
      assert.equal(mockFs.files['good'], 'fileContent');
    })
    it('should throw error if file does not exists', () => {
      assert.throws(() => {
        mockFs.writeFileSync('badFile', 'fileContent')
      }, 'file not found');
    })
  })
})
