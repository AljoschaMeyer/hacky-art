const html = require('choo/html');

const nav = require('../views/nav');
const publication = require('../views/publication');

const { pageSize, getOrCreateFeed, getAuthor, getMsg, getImg } = require('../helpers/caching');
const { deescapeMsg } = require('../helpers/escape');

module.exports = (state, emit) => {
  const msgId = deescapeMsg(state.params.publication);
  const msg = getMsg(state.main.msgCache, state.ssb, emit, msgId);

  if (!msg) {
    return html`<body>
    ${nav({ me: state.ssb ? state.ssb.id : undefined })}
    <h3 class="msgId">${msgId}</h3>
    Loading...
  </body>`;
} else {
  const author = getAuthor(state.main.authorCache, state.ssb, emit, msg.author);;
  const blob = new Blob(getImg(state.main.imgCache, state.ssb, emit, msg.content.img));

  return html`<body>
${nav({ me: state.ssb.id })}
<div class="publication">${publication({
    timestamp: msg.timestamp,
    title: msg.content.title,
    description: msg.content.description,
    caption: msg.content.caption,
    size: msg.content.size,
    msgId,
    author,
    authorId: msg.author,
    blob
  }, emit)}</div>
</body>`;
  }
};
