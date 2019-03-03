const mainPage = require('../pages/main');

module.exports = (state, emitter, app) => {
  emitter.on('DOMContentLoaded', () => {
    emitter.on('login', ssb => {
      state.ssb = ssb; // give the app access to the ssb client connection
      app.route('/', mainPage);
      app.emit('pushState', '/'); // navigate to main page
    });
  });
};
