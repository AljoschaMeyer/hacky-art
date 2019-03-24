const html = require('choo/html');

const publication = require('./publication');
const pagination = require('./pagination');

const { getAuthor, getImg } = require('../helpers/caching');

module.exports = (state, emit) => {
  return html`<ul class="publications">
  ${state.msgs.map(msg => {
    const author = getAuthor(state.authorCache, state.ssb, emit, msg.author);
    const blob = new Blob(getImg(state.imgCache, state.ssb, emit, msg.content.img));

    return html`<li class="publication">${publication({
        timestamp: msg.timestamp,
        title: msg.content.title,
        description: msg.content.description,
        caption: msg.content.caption,
        size: msg.content.size,
        msgId: msg.msgId,
        author,
        authorId: msg.author,
        blob
      }, emit)}</li>`;
  })}
</ul>
${pagination({ author: state.author }, emit)}
`;
};
