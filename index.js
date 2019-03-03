const choo = require('choo');
const html = require('choo/html');

const login = require('./pages/login');
const main = require('./pages/main');
const publish = require('./pages/publish');

const app = choo();

app.route('/', login);
app.route('/publish', publish);

app.mount('body');

app.use((state, emitter) => {
  state.main = {
    loading: true,
    pubs: [],
    imgsLoaded: {},
  };

  emitter.on('DOMContentLoaded', () => {
    emitter.on('login', ssb => {
      state.ssb = ssb;
      app.route('/', main);
      app.emit('pushState', '/');
    });

    emitter.on('navigate', () => {
      if (state.route === '/' && state.ssb) {
        state.main.loading = true;
      }
    });

    emitter.on('main:loaded', pubs => {
      state.main.loading = false;
      state.main.pubs = pubs;
      app.emit('render');
    });

    emitter.on('img:loaded', ({id, blob}) => {
      state.main.imgsLoaded[id] = blob;
      app.emit('render');
    });
  });
});
