const pull = require('pull-stream');

const { getBlob } = require('../util');

module.exports = (state, emitter) => {
  state.main = {
    loading: true, // true while waiting for the ssb messages that make up the main feed
    pubs: undefined, // becomes populated with an array of the loaded feed messages
    imgsLoaded: new Map(), // map from blob ids to loaded blobs. Currently grows unbounded... TODO FIXME
  };

  emitter.on('DOMContentLoaded', () => {
    emitter.on('navigate', () => {
      if (
        state.ssb && // user is logged in
        state.route === '/' // viewing the main feed
      ) {
        // tell the view to render a loading screen
        state.main.loading = true;

        // start loading the main feed (we simply redo all the work each time
        // the user goes to the main view)
        pull(
          state.ssb.messagesByType({
            type: 'tamaki:publication',
            reverse: true,
            keys: false,
            limit: 100,
            live: false,
          }),
          pull.collect((err, pubs) => {
            if (err) {
              throw err;
            }
            // tell the app when loading is done
            emitter.emit('main:loaded', pubs);

            // start loading all the blobs
            pubs.forEach(msg => {
              const id = msg.content.img;

              if (!state.main.imgsLoaded.has(id)) {
                getBlob(state.ssb, id, (err, blob) => {
                  if (err) {
                    throw err;
                  }

                  // tell the app when a blob has been loaded
                  emitter.emit('main:img:loaded', {
                    id,
                    blob,
                  });
                });
              }
            });
          })
        );
      }
    });

    // transition from loading screen to displaying the feed
    emitter.on('main:loaded', pubs => {
      state.main.loading = false;
      state.main.pubs = pubs;
      emitter.emit('render');
    });

    // display images as their blobs become available
    emitter.on('main:img:loaded', ({id, blob}) => {
      state.main.imgsLoaded.set(id, blob); // make the blob available to the views (and incidentally cache it)
      emitter.emit('render');
    });
  });
};
