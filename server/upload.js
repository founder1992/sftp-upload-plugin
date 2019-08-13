const Client = require ('ssh2-sftp-client');
const sftp = new Client ();
const path = require ('path');
const fs = require ('fs');
const _cliProgress = require('cli-progress');

/*
  flies async reader
 */
const fsReaddir = async (lp) => {
  return new Promise((resolve, reject) => {
    fs.readdir(lp, function (err, files) {
      err && reject(err);
      resolve(files);
    })
  })
};

/*
  flies async getter
 */
const fsStat = async (p) => {
  return new Promise((resolve, reject) => {
    fs.stat(p, function (error, stats) {
      error && reject(error);
      resolve(stats);
    })
  })
};

/*
  files dir path and file path queue getter
 */
const finderGetter = async (localPath) => {
  let fileHandler = [];
  let dirHandler = [];

  const fileTreeGetter = async (lp = localPath) => {
    let files = await fsReaddir(lp);

    for (let i = 0; i < files.length; i++) {
      let p = path.join(lp, files[i]);
      let stats = await fsStat(p);
      if (stats.isFile ()) {
        fileHandler.push(p);
        continue
      }
      dirHandler.push(p);
      await fileTreeGetter(p);
    }
  };

  await fileTreeGetter();
  return {fileHandler, dirHandler}
};

/*
  upload file through dir path
 */
sftp.dirPut = async function(localPath, remotePath) {
  const { fileHandler, dirHandler } = await finderGetter(localPath);

  // create dirs
  for (let i = 0; i < dirHandler.length; i++) {
    try {
      await this.mkdir(dirHandler[i].replace(localPath, remotePath), true)
    } catch (e) {
    }
  }

  console.log('--------- start loading ---------');

  const bar = new _cliProgress.SingleBar({}, _cliProgress.Presets.rect);
  bar.start(fileHandler.length, 0);
  // create files
  for (let i = 0; i < fileHandler.length; i++) {
    try {
      bar.update(i + 1);
      await this.put(fileHandler[i], fileHandler[i].replace(localPath, remotePath))
    } catch (e) {
      continue
    }
  }
  bar.stop();

  console.log('--------- finish ---------');

  return 'Finish upload'
};

// 开始上传
function upload (config) {
  sftp
    .connect (config)
    .then (() => {
      sftp.dirPut(config.localPath, config.remotePath)
        .then(() => process.exit(0))
    })
    .catch (err => {
      console.log ('发生错误');
      console.log (err);
    });
}

module.exports = upload;
