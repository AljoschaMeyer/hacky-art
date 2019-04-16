const html = require('choo/html');
const pull = require('pull-stream');
const once = require('pull-stream/sources/once');
const pullFileReader = require('pull-filereader');

const nav = require('../views/nav');

module.exports = (state, emit) => {
  return html`<body>
  ${nav({ me: state.ssb.id }, emit)}
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
  ${state.publishInput.blob
  // When an image file has been selected, display the add'l details form
    ? html`
      <div class='publish-form-addl-details'>
      <h1>Add Additional Details</h1>
      <form onsubmit="${onsubmit}" id='publish-form'>
          <span class='publish-figure'>
            <img class="publicationImg" src="${URL.createObjectURL(state.publishInput.blob)}" />
            <button id="removeImg" onclick=${removeImage}>Remove Image</button>
            <input class='hidden' disabled type="file" name="imgInput" id="imgInput" accept="image/gif, image/jpeg, image/png, image/apng" >
            <label for="imgCaption">Caption</label>
            <textarea name="imgCaption" id="imgCaption" placeholder="HEY HEY, CLICK TO WRITE A CAPTION HERE!  Please describe, as accurately and concisely as possible, the visual details of your image. This wouldn't be additional context or stories about the image, but a literal description of it.  This helps accessibility for visually impaired friends."></textarea>
          </span>
          <label for="imgTitle">Title</label>
          <input type="text" name="imgTitle" id="imgTitle" value="" placeholder="HEY HEY WRITE A TITLE HERE!">
          <label for="imgDesc">Description</label>
          <span class='description'>
            <textarea name="imgDesc" id="imgDesc" placeholder="AND HEY HEY, WRITE A DESCRIPTION HERE!  Here is the best place for any feelings, contexts, stories, and what-have-you about the image you've shared.  It's optional of course.  Everything is."></textarea>
          </span>
          <input type="submit" name="publish" value="Preview & Publish">
        </form>
        </div>
        `
  // Otherwise, display the image file selector
    : html`
        <form id='img-input-form'>
          <label for="imgInput">Select an image to publish</label>
        <input
          type="file"
          onchange=${onChange}
          name="imgInput"
          id="imgInput"
          accept="image/gif, image/jpeg, image/png, , image/apng"
          required>
        </form>
      `
    }
</body>`;

  function onChange (event) {
    event.preventDefault();
    const imgInput = document.querySelector('#imgInput');
    const imgFile = imgInput.files[0];
    emit('preview image added', imgFile);
  }

  function removeImage () {
    event.preventDefault();
    emit('preview image removed');
  }

  function onsubmit(event) {
    event.preventDefault();

    const imgInput = document.querySelector('#imgInput');
    let imgFile = imgInput.files[0];

    const imgTitle = document.querySelector('#imgTitle');
    const title = imgTitle.value;

    const imgDesc = document.querySelector('#imgDesc');
    const description = imgDesc.value;

    const imgCaption = document.querySelector('#imgCaption');
    const caption = imgCaption.value;

    if (!imgFile) {
      imgFile = state.publishInput.blob;
    }

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
