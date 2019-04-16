const html = require('choo/html');

const nav = require('../views/nav');
const publications = require('../views/publications');

module.exports = (state, emit) => {
  if (state.main.mainFeed.loading) {
    emit('feed:load', {});

    return html`<body>
  ${nav({ me: state.ssb ? state.ssb.id : undefined }, emit)}
  Loading...
</body>`;
  } else {
    return html`<body>
  ${nav({ me: state.ssb.id }, emit)}
  ${publications({
    msgs: state.main.mainFeed.msgs,
    authorCache: state.main.authorCache,
    imgCache: state.main.imgCache,
    ssb: state.ssb,
    author: undefined,
  }, emit)}
  </body>`;
  }
};
