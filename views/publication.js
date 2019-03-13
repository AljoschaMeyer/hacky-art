const html = require('choo/html');

const { escapeKey, escapeMsg } = require('../helpers/escape');

module.exports = (state, emit) => {
  return html`<figure>
    ${
    state.blob ?
    html`<a href="/publication/${escapeMsg(state.msgId)}">
        <img class="publicationImg" src="${URL.createObjectURL(state.blob)}"></img>
      </a>` :
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
    <time class="pubTime">${new Date(state.timestamp)}</time>
    </div>
    ${
    typeof state.description === 'string' && state.description.length > 0 ?
    html`<div class="publicationDescription">${state.description}</div>` :
    ''
    }
    </figcaption>

    </figure>`;
};
