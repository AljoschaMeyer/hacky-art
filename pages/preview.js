const html = require('choo/html');
const pull = require('pull-stream');
const once = require('pull-stream/sources/once');
const pullFileReader = require('pull-filereader');

const publication = require('../views/publication');

const { getAuthor } = require('../helpers/caching');

module.exports = (state, emit) => {
  const preview = state.preview;
  return html`<body>
  <div class="preview">${publication({
      timestamp: Date.now(),
      title: preview.title,
      description: preview.description,
      caption: preview.caption,
      size: preview.imgFile.size,
      author: getAuthor(preview.authorCache, preview.ssb, emit, preview.ssb.id),
      authorId: preview.ssb.id,
      blob: preview.imgFile,
    }, emit)}</div>
  <div id='publish-preview'>
    <button class="previewConfirm" onclick="${onconfirm}">Confirm</button>
    <button class="previewCancel" onclick="${oncancel}">Cancel</button>
  </div>
</body>`;

  function oncancel() {
    emit('publishData', {
      title: preview.title,
      description: preview.description,
      caption: preview.caption,
    });
    emit('pushState', '/publish');
  }

  function onconfirm() {
    pull(
      pullFileReader(preview.imgFile),
      state.ssb.blobs.add((err, hash) => {
        if (err) {
          throw err;
        }

        state.ssb.publish({
          type: 'tamaki:publication',
          img: hash,
          title: preview.title,
          description: preview.description,
          caption: preview.caption,
          imgSize: preview.imgSize,
        }, err => {
          if (err) {
            emit('publishData', {
              title: preview.title,
              description: preview.description,
              caption: preview.caption,
            });
            emit('publishError', err)
            emit('pushState', '/publish');
          } else {
            emit('publishError'); // clears the error from the state
            emit('publishData', {});
            emit('pushState', '/');
          }
        });
      })
    );
  }
}
