const upload = require ('./server/upload');

class SftpUploadPlugin {
  constructor(config) {
    this.config = config;
  }

  apply(compiler) {
    compiler.hooks.done.tap('done', () => {
      upload(this.config);
    });

    compiler.hooks.failed.tap('failed', (err) => {
      console.log(err);
    });
  }
}

module.exports = SftpUploadPlugin;