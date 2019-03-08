const client = require('ssb-client');

module.exports = (state, emitter, app) => {
  emitter.on('DOMContentLoaded', () => {
    state.connection = {};

    emitter.on('connection:connecting', () => {
      state.connection.status = 'connecting';
      emitter.emit('pushState', '/connection');

      const config = require('../config');
      client(config.keys, config, (err, server) => {
        if (err) {
          emitter.emit('connection:error', err);
        } else {
          emitter.emit('connection:connected', server);
        }
      });
    });

    emitter.on('connection:connected', ssb => {
      state.ssb = ssb; // give the app access to the ssb client connection
      state.connection.status = 'connected';
      emitter.emit('pushState', '/'); // navigate to main page
    });

    emitter.on('connection:error', err => {
      state.connection.status = 'error';
      state.connection.err = err;
      emitter.emit('pushState', '/connection')
    });

    emitter.emit('connection:connecting');
  });
};
