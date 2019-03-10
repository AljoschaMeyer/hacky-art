const html = require('choo/html');

const publication = require('./publication');
const pagination = require('./pagination');

const { getAuthor, getImg } = require('../helpers/caching');

module.exports = (state, emit) => {
  return html`<ol class="publications">
  ${state.msgs.map(msg => {
    const author = getAuthor(state.authorCache, state.ssb, emit, msg.author);
    const blob = new Blob(getImg(state.imgCache, state.ssb, emit, msg.content.img));

    return html`<li>${publication({
        timestamp: msg.timestamp,
        title: msg.content.title,
        description: msg.content.description,
        size: msg.content.size,
        author,
        authorId: msg.author,
        blob,
      }, emit)}</li>`;
  })}
</ol>
${pagination({ author: state.author }, emit)}
`;
};
