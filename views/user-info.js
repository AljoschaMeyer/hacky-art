const html = require('choo/html');

module.exports = (state, emit) => {
  return html`<div class="userInfo">
  <div class="author">${state.author}</div>
  <code class="authorId">${state.id}</code>
</div>`;
};
