const Connection = require('ssb-client');
const Config = require('ssb-config/inject');

const mainPage = require('../pages/main');

const port = 8989;

module.exports = (state, emitter, app) => {
  emitter.on('DOMContentLoaded', () => {
    const config = require('../config');
    Connection(config.keys, config, (err, server) => {
      if (err) {
        throw err;
      } else {
        // if (document.querySelector('#autologin').checked) {
        //   localStorage.setItem('ssb-keys', JSON.stringify(keys));
        // }
        // console.log('qwert');
        emitter.emit('login:yay', server);
      }
    });

    // emitter.on('login:connect', keys => {
    //   console.log(keys);
    //
    //   const config = require('../config');
    //   Connection(config.keys, config, (err, server) => {
    //     if (err) {
    //       throw err;
    //     } else {
    //       // if (document.querySelector('#autologin').checked) {
    //       //   localStorage.setItem('ssb-keys', JSON.stringify(keys));
    //       // }
    //       console.log('qwert');
    //       emitter.emit('login:yay', server);
    //     }
    //   });
    // });

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
