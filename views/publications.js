const html = require('choo/html');

const publication = require('./publication');
const pagination = require('./pagination');

const { getAuthor, getImg } = require('../helpers/caching');

module.exports = (state, emit) => {
  return html`<ol class="publications">
  ${state.msgs.map(msg => {
    const author = getAuthor(state.authorCache, state.ssb, emit, msg.author);
    const blob = getImg(state.imgCache, state.ssb, emit, msg.content.img);

    return html`<li>${publication({
        msg,
        author,
        authorId: msg.author,
        blob,
        ssb: state.ssb,
      }, emit)}</li>`;
  })}
</ol>
${pagination({ author: state.author }, emit)}
`;
};
