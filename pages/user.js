const html = require('choo/html');

const nav = require('../views/nav');
const userInfo = require('../views/user-info');
const publications = require('../views/publications');

const { pageSize, getOrCreateFeed, getAuthor } = require('../helpers/caching');
const { deescapeKey } = require('../helpers/escape');

module.exports = (state, emit) => {
  const user = deescapeKey(state.params.user);
  const feedState = getOrCreateFeed(pageSize, state, user);
  const author = getAuthor(state.main.authorCache, state.ssb, emit, user);

  if (feedState.loading) {
    emit('feed:load', { author: user });

    return html`<body>
    ${nav({ me: state.ssb ? state.ssb.id : undefined })}
    ${userInfo({ id: user }, emit)}
    <h3 class="userId">${user}</h3>
    Loading...
  </body>`;
} else {
  return html`<body>
${nav({ me: state.ssb.id }, emit)}
${userInfo({ id: user, author }, emit)}
${publications({
  msgs: feedState.msgs,
  authorCache: state.main.authorCache,
  imgCache: state.main.imgCache,
  ssb: state.ssb,
  author: user,
}, emit)}
</body>`;
  }
};
