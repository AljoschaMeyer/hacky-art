const fs = require('fs');
const Path = require('path');
const electron = require('electron');

const createSbot = require('ssb-server')
  .use(require('ssb-server/plugins/master'))
  .use(require('ssb-server/plugins/logging'))
  .use(require('ssb-server/plugins/unix-socket'))
  .use(require('ssb-server/plugins/no-auth'))
  .use(require('ssb-server/plugins/onion'))
  .use(require('ssb-server/plugins/local'))

  .use(require('ssb-gossip'))
  .use(require('ssb-replicate'))
  .use(require('ssb-friends'))
  .use(require('ssb-ebt'))

  .use(require('ssb-blobs'))
  .use(require('ssb-ws'))

  .use(require('ssb-social-index')('about'))
  .use(require('ssb-backlinks'))
  .use(require('ssb-query'));

const config = require('./config');

const sbot = createSbot(config);
const manifest = sbot.getManifest();
fs.writeFileSync(Path.join(config.path, 'manifest.json'), JSON.stringify(manifest));
electron.ipcRenderer.send('server-started');
