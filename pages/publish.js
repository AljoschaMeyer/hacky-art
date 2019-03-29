const html = require('choo/html')
const pull = require('pull-stream')
const once = require('pull-stream/sources/once')
const pullFileReader = require('pull-filereader')

const nav = require('../views/nav')

module.exports = (state, emit) => {
  return html`<body>
  ${nav({ me: state.ssb.id })}
  ${
  state.publishError
    ? html`<div class="error">
     ${
    state.publishError.message === 'encoded message must not be larger than 8192 bytes' ?
    html`The description, caption or title is too large, you'll need to cut some words.` :
    html`An unexpected error occured.<code>${JSON.stringify(state.publishError)}</code>`
      }
    </div>`
    : html``
  }
  <form onsubmit="${onsubmit}" id='publish-form'>
    ${state.publishInput.blob
      ? html`
        <div>
          <button onclick=${removeImage}>Remove Image</button>
          <img class="publicationImg" src="${URL.createObjectURL(state.publishInput.blob)}" />
        </div>`
      : html`
        <label for="imgInput">Select an image to publish</label>
        <input type="file" onchange=${onChange} name="imgInput" id="imgInput" accept="image/gif, image/jpeg, image/png, , image/apng" required>
      `
    }
    <label for="imgCaption">Caption</label>
    <textarea name="imgCaption" id="imgCaption">${state.publishData.caption}</textarea>
    <label for="imgTitle">Title</label>
    <input type="text" name="imgTitle" id="imgTitle" value="${state.publishData.title}">
    <label for="imgDesc">Description</label>
    <textarea name="imgDesc" id="imgDesc">${state.publishData.description}</textarea>
    <input type="submit" name="publish" value="Preview & Publish">
  </form>
</body>`;

  function onChange (event) {
    event.preventDefault();
    const imgInput = document.querySelector('#imgInput');
    const imgFile = imgInput.files[0];
    emit('preview image added', imgFile)
  }

  function removeImage () {
    event.preventDefault()
    emit('preview image removed')
  }

  function onsubmit(event) {
    event.preventDefault();

    const imgInput = document.querySelector('#imgInput');
    const imgFile = imgInput.files[0];

    const imgTitle = document.querySelector('#imgTitle');
    const title = imgTitle.value;

    const imgDesc = document.querySelector('#imgDesc');
    const description = imgDesc.value;

    const imgCaption = document.querySelector('#imgCaption');
    const caption = imgCaption.value;

    emit('preview', {
      imgFile,
      title,
      description,
      caption,
      authorCache: state.main.authorCache,
      ssb: state.ssb,
    });
  }
}
