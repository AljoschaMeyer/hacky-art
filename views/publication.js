const html = require('choo/html');

module.exports = (state, emit) => {
  return html`<div class="publication">
<div class="author">${state.author}</div>
<time class="pubTime">Time: ${state.msg.timestamp}</time>
${
  state.blob ?
  html`<img class="publicationImg" src="${URL.createObjectURL(new Blob(state.blob))}"></img>` :
  html`<div class="imgLoading">Image loading...</div>`
}
</div>`;
};
