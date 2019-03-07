const pull = require('pull-stream');

const { getBlob } = require('../util');

module.exports = (state, emitter) => {
  state.main = {
    loading: true, // true while waiting for the ssb messages that make up the main feed
    pubs: undefined, // becomes populated with an array of the loaded feed messages
    imgsLoaded: new Map(), // map from blob ids to loaded blobs. Currently grows unbounded... TODO FIXME
    authorsLoaded: new Map(), // map from author ids to names. Currently grows unbounded... TODO FIXME
  };

  emitter.on('DOMContentLoaded', () => {
    emitter.on('navigate', () => {
      if (
        state.ssb && // user is logged in
        state.route === '/' // viewing the main feed
      ) {
        // tell the view to render a loading screen
        state.main.loading = true;

        const opts = {
          limit: 100,
          reverse: true,
          query: [
            {
              $filter: {
                value: {
                  content: { type: 'tamaki:publication' },
                  timestamp: {
                    $gte: 0,
                  }
                }
              }
            },
            {
              $map: ['value'],
            }
          ]
        };

        pull(
          state.ssb.query.read(opts),
          pull.collect((err, pubs) => {
            if (err) {
              throw err;
            }
            // tell the app when loading is done
            emitter.emit('main:loaded', pubs);

            // start loading all the blobs
            pubs.forEach(msg => {
              const id = msg.content.img;
              const author = msg.author;

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

              if (!state.main.authorsLoaded.has(author)) {
                state.ssb.about.socialValue({ key: 'name', dest: author }, (err, name) => {
                  if (err) {
                    throw err;
                  }

                  // tell the app when a blob has been loaded
                  emitter.emit('main:author:loaded', {
                    id: author,
                    name,
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

    // display human-readable author names as they become available
    emitter.on('main:author:loaded', ({id, name}) => {
      state.main.authorsLoaded.set(id, `@${name}`); // make the name available to the views (and incidentally cache it)
      emitter.emit('render');
    });
  });
};
