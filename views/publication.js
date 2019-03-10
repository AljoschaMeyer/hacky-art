const html = require('choo/html');
const human = require('human-time');

const { escapeKey } = require('../helpers/escape');

module.exports = (state, emit) => {
  return html`<div class="publication">
<a class="author" href="/user/${escapeKey(state.authorId)}">${state.author}</a>
<time class="pubTime">${human(new Date(state.timestamp))}</time>
${
  typeof state.title === 'string' && state.title.length > 0 ?
  html`<h4 class="publicationTitle">${state.title}</h4>` :
  ''
}
${
  state.blob ?
  html`<img class="publicationImg" src="${URL.createObjectURL(state.blob)}"></img>` :
  html`<div class="imgLoading">Image loading...</div>`
}
${
  typeof state.description === 'string' && state.description.length > 0 ?
  html`<div class="publicationDescription">${state.description}</div>` :
  ''
}
</div>`;
};
