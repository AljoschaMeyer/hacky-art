const html = require('choo/html');

const publication = require('./publication');

module.exports = (state, emit) => {
  return html`<ol class="publications">
  ${state.main.pubs.map(msg => {
    const authorCached = state.main.authorCache.get(msg.author);
    const author = authorCached ? authorCached : `@${msg.author}`;

    return html`<li>${publication({
        msg,
        author,
        blob: state.main.imgCache.get(msg.content.img),
        ssb: state.ssb,
      }, emit)}</li>`;
  })}
</ol>`;
};
