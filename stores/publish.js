const client = require('ssb-client');

module.exports = (state, emitter, app) => {
  state.publishData = {};
  state.publishInput = {};

  emitter.on('DOMContentLoaded', () => {
    emitter.on('preview', data => {
      state.preview = data;
      emitter.emit('pushState', '/preview');
    });

    emitter.on('preview image added', data => {
        state.publishInput.blob = data;
        emitter.emit('pushState', '/publish');
    });

    emitter.on('preview image removed', data => {
      state.publishInput.blob = null;
      emitter.emit('pushState', '/publish');
    });

    emitter.on('publishData', data => {
      state.publishInput= {};
      state.publishData = data;
    });

    emitter.on('publishError', err => {
      state.publishError = err;
    });
  });
};
