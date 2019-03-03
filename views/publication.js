const html = require('choo/html');
const pull = require('pull-stream');

const getBlob = (ssb, id, cb) => {
  ssb.blobs.want(id, err => {
    if (err) {
      return cb(err);
    }

    pull(
      ssb.blobs.get(id),
      pull.collect((err, blob) => {
        if (err) {
          return cb(err);
        }

        return cb(null, blob);
      })
    );
  });
};

module.exports = (state, emit) => {
  if (state.blob) {
    return html`<div class="publication">
  <div class="author">${state.msg.author}</div>
  <time class="pubTime">Time: ${state.msg.timestamp}</time>
  <img class="publicationImg" src="${URL.createObjectURL(new Blob(state.blob))}"></img>
</div>`;
  } else {
    getBlob(state.ssb, state.msg.content.img, (err, blob) => {
      emit('img:loaded', {
        id: state.msg.content.img,
        blob,
      });
    });

    return html`<div class="publication">
  <div class="author">${state.msg.author}</div>
  <time class="pubTime">Time: ${state.msg.timestamp}</time>
  <div class="imgLoading">Image loading...</div>
</div>`;
  }
};
