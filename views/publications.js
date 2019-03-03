const html = require('choo/html');

const publication = require('./publication');

module.exports = (state, emit) => {
  return html`<ol class="publications">
  ${state.main.pubs.map(msg => html`<li>${publication({
      msg,
      blob: state.main.imgsLoaded.get(msg.content.img),
      ssb: state.ssb,
    }, emit)}</li>`)}
</ol>`;
};
