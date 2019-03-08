const html = require('choo/html');
const pull = require('pull-stream');
const once = require('pull-stream/sources/once');
const pullFileReader = require('pull-filereader');

const nav = require('../views/nav');

module.exports = (state, emit) => {
  return html`<body>
  ${nav()}
  <form onsubmit=${onsubmit}>
    <label for="imgInput">Select an image to publish</label>
    <input type="file" name="imgInput" id="imgInput" accept="image/gif, image/jpeg, image/png, , image/apng" required>
    <label for="imgTitle">Title</label>
    <input type="text" id="imgTitle">
    <label for="imgDesc">Description</label>
    <textarea name="imgDesc" id="imgDesc"></textarea>
    <input type="submit" name="publish" value="Publish">
  </form>
</body>`;

  function onsubmit(event) {
    event.preventDefault();

    const imgInput = document.querySelector('#imgInput');
    const imgSize = imgInput.files[0].size;
    pull(
      pullFileReader(imgInput.files[0]),
      state.ssb.blobs.add((err, hash) => {
        if (err) {
          throw err;
        }

        const imgTitle = document.querySelector('#imgTitle');
        const title = imgTitle.value;

        const imgDesc = document.querySelector('#imgDesc');
        const description = imgDesc.value;

        state.ssb.publish({
          type: 'tamaki:publication',
          img: hash,
          title,
          description,
          imgSize,
        }, err => {
          if (err) {
            throw err;
          }
          emit('pushState', '/');
        });
      })
    );
  }
}
