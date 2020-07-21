const ora = require('ora');
const chalk = require('chalk');

export default class Spinner {
  constructor(options = { prefixText: '🌟' }) {
    this.options = options;
    this.fileCount = 0;
    this.uploading = 0;
    this.uploadedFiles = {};
    this.delRecords = {};
  }
  start(filename) {
    this.uploading += 1;
    const text = `Uploading ${chalk.green(filename)} ${this.uploading}/${this.fileCount}\n`;
    if (this.spinner) {
      this.spinner.text = text;
    } else {
      this.spinner = ora({ ...this.options, text }).start();
    }
  }
  end(filename, resultUrl) {
    this.uploadedFiles[filename] = resultUrl;
    const uploadedFilenames = Object.keys(this.uploadedFiles);
    if (uploadedFilenames.length === this.fileCount) {
      this.spinner && this.spinner.succeed(`Upload complete ${this.fileCount}/${this.fileCount}`);
      uploadedFilenames.forEach(key => {
        let text = `${chalk.green(key)} is uploaded`;
        if (this.uploadedFiles[key]) {
          text += ` and it will be as ${chalk.blue(this.uploadedFiles[key])}`;
        }
        ora({ ...this.options, text }).succeed();
      });
    }
  }
  setFileCount(fileCount) {
    this.fileCount = fileCount;
  }
  delCount(filename) {
    if (this.delRecords[filename]) return;

    this.delRecords[filename] = true;
    this.fileCount -= 1;
  }
}
