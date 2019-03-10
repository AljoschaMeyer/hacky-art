const html = require('choo/html');

const publication = require('./publication');

module.exports = (state, emit) => {
  return html`<ol class="publications">
  ${state.pubs.map(msg => {
    const authorCached = state.authorCache.get(msg.author);
    const author = authorCached ? authorCached : `@${msg.author}`;

    return html`<li>${publication({
        msg,
        author,
        blob: state.imgCache.get(msg.content.img),
        ssb: state.ssb,
      }, emit)}</li>`;
  })}
</ol>`;
};
