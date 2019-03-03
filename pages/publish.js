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
    <input type="submit" name="publish" value="Publish" checked>
  </form>
</body>`;

  function onsubmit(event) {
    event.preventDefault();

    const imgInput = document.querySelector('#imgInput');
    pull(
      pullFileReader(imgInput.files[0]),
      state.ssb.blobs.add((err, hash) => {
        if (err) {
          throw err;
        }

        state.ssb.publish({
          type: 'tamaki:publication',
          img: hash,
        }, (err, foo) => {
          console.log(foo);
          emit('pushState', '/');
        });
      })
    );
  }
}
