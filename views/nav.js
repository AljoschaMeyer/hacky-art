const html = require('choo/html');

const { escapeKey } = require('../helpers/escape');

module.exports = (state, emit) => {
  return html`<nav class="mainNav">
  <a href="/">Home</a>
  <a onclick=${() => { console.log('lel'); emit('popState')}}>Go Back</a>
  ${
    state.me ?
    html`<a href="/user/${escapeKey(state.me)}">Me</a>` :
    html``
  }
  <a href="/publish">Publish</a>
</nav>`;
};
