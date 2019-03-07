const Config = require('ssb-config/inject');
const Path = require('path');
const merge = require('lodash.merge');

config = Config(process.env.ssb_appname || 'ssb');

addSockets(config);
fixLocalhost(config);

module.exports = config;

function addSockets (config) {
  if (process.platform === 'win32') {
    return;
  }

  const pubkey = config.keys.id.slice(1).replace(`.${config.keys.curve}`, '');
  merge(
    config,
    {
      connections: {
        incoming: { unix: [{ scope: 'device', transform: 'noauth', server: true }] }
      },
      remote: `unix:${Path.join(config.path, 'socket')}:~noauth:${pubkey}` // overwrites
    }
  );
}

function fixLocalhost (config) {
  if (process.platform !== 'win32') {
    return;
  }

  // without this host defaults to :: which doesn't work on windows 10?
  config.connections.incoming.net[0].host = '127.0.0.1';
  config.connections.incoming.ws[0].host = '127.0.0.1';
  config.host = '127.0.0.1';
}
