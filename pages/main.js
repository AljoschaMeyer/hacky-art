const html = require('choo/html');
const pull = require('pull-stream');
const collect = require('pull-stream/sinks/collect');

const nav = require('../views/nav');
const publications = require('../views/publications');

module.exports = (state, emit) => {
  if (state.main.loading) {
    pull(
      state.ssb.messagesByType({
        type: 'tamaki:publication',
        reversed: true,
        keys: false,
        limit: 100,
        live: false,
      }),
      collect((err, pubs) => {
        if (err) {
          throw err;
        }
        emit('main:loaded', pubs);
      })
    );

    return html`<body>
  ${nav()}
  Loading...
</body>`;
  } else {
    return html`<body>
  ${nav()}
  ${publications(state, emit)}
  </body>`;
  }
}
