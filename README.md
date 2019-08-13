# sftp-upload-plugin
upload code through sftp when finish build

##Installation
```$xslt
npm i sftp-upload-plugin
```

##Usage
use in your webpack plugin config
```
// in your webpack config
const sftpUploadPlugin = require('sftp-upload-plugin');

plugins: [
    new sftpUploadPlugin({
      host: '120.77.xxx.xxx',
      port: '22',
      username: 'founder',
      password: 'xxxxxxx',
      localPath: '/Users/xiaoming/Desktop/demo/dist',
      remotePath: '/opt/demo/dist'
    })
]
```

##Result

when webpack bundle finish you'll see like

```$xslt
--------- start loading ---------
 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 100% | ETA: 0s | 151/151
--------- finish ---------

```

##License
MIT

