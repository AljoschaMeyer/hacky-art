const Connection = require('ssb-client');

const mainPage = require('../pages/main');

const port = 8989;

module.exports = (state, emitter, app) => {
  emitter.on('DOMContentLoaded', () => {
    emitter.on('login:connect', keys => {
      Connection(keys, {
        manifest: require('../manifest.json'),
        remote: `ws://localhost:${port}/~shs:${keys.public}`,
        caps: {
          shs: "1KHLiKZvAvjbY1ziZEHMXawbCEIM6qwjCDm3VYRan/s=",
          sign: null
        }
      }, (err, server) => {
        if (err) {
          throw err;
        } else {
          if (document.querySelector('#autologin').checked) {
            localStorage.setItem('ssb-keys', JSON.stringify(keys));
          }
          emitter.emit('login:yay', server);
        }
      });
    });

    emitter.on('login:yay', ssb => {
      state.ssb = ssb; // give the app access to the ssb client connection

      app.route('/', mainPage);
      app.route('/user/:user', mainPage);
      emitter.emit('pushState', '/'); // navigate to main page
    });

    emitter.on('secret:error', err => {
      throw err;
    });
  });
};
