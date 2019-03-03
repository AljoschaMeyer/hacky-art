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

module.exports = {
  getBlob,
};
