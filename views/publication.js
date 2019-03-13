const html = require('choo/html');
const human = require('human-time');

const { escapeKey } = require('../helpers/escape');

module.exports = (state, emit) => {
  return html`<figure>

    ${
    state.blob ?
    html`<img class="publicationImg" src="${URL.createObjectURL(state.blob)}"></img>` :
    html`<div class="imgLoading">Image loading...</div>`
    }

    <figcaption>
    ${
    typeof state.title === 'string' && state.title.length > 0 ?
    html`<h2 class="publicationTitle">${state.title}</h2>` :
    ''
    }
    <div class="authorAndTime">
    <a class="author" href="/user/${escapeKey(state.authorId)}">${state.author}</a>
    <time class="pubTime">${human(new Date(state.timestamp))}</time>
    </div>
    ${
    typeof state.description === 'string' && state.description.length > 0 ?
    html`<div class="publicationDescription">${state.description}</div>` :
    ''
    }
    </figcaption>

    </figure>`;
};
