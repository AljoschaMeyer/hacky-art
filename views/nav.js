const html = require('choo/html');

module.exports = (state, emit) => {
  return html`<nav class="mainNav">
  <a href="/">Home</a>
  <a href="/publish">Publish</a>
</nav>`;
};
