const html = require('choo/html');

module.exports = (state, emit) => {
  return html`<div class="publication">
<div class="author">${state.author}</div>
<time class="pubTime">Time: ${state.msg.timestamp}</time>
${
  typeof state.msg.title === 'string' && state.msg.title.length > 0 ?
  html`<h4 class="publicationTitle">${state.msg.title}</h4>` :
  ''
}
${
  state.blob ?
  html`<img class="publicationImg" src="${URL.createObjectURL(new Blob(state.blob))}"></img>` :
  html`<div class="imgLoading">Image loading...</div>`
}
${
  typeof state.msg.description === 'string' && state.msg.description.length > 0 ?
  html`<div class="publicationDescription">${state.msg.description}</div>` :
  ''
}
</div>`;
};
