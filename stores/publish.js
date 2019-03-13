const client = require('ssb-client');

module.exports = (state, emitter, app) => {
  state.publishData = {};

  emitter.on('DOMContentLoaded', () => {
    emitter.on('preview', data => {
      state.preview = data;
      emitter.emit('pushState', '/preview')
    });

    emitter.on('publishData', data => {
      state.publishData = data;
    });
  });
};
