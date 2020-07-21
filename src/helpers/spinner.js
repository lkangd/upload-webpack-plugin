const ora = require('ora');
const chalk = require('chalk');

export default class Spinner {
  constructor(options = { prefixText: '🌟' }) {
    this.options = options;
    this.fileCount = 0;
    this.uploaded = 0;
    this.uploading = 0;
    this.spinnerMaps = {};
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
    this.uploaded += 1;
    this.spinnerMaps[filename] = resultUrl;
    if (this.isOver()) {
      this.spinner && this.spinner.succeed(`Upload complete ${this.uploaded}/${this.fileCount}`);
      Object.keys(this.spinnerMaps).forEach(key => {
        let text = `${chalk.green(key)} is uploaded`;
        if (this.spinnerMaps[key]) {
          text += ` and it will be as ${chalk.blue(this.spinnerMaps[key])}`;
        }
        ora({ ...this.options, text }).succeed();
      });
    }
  }
  setFileCount(fileCount) {
    this.fileCount = fileCount;
  }
  isOver() {
    return this.fileCount === this.uploaded;
  }
}
