const pull = require('pull-stream');
const Lru = require('quick-lru');

const { getBlob, newPaginatedQuery } = require('../util');

module.exports = (state, emitter) => {
  state.main = {
    loading: true, // true while waiting for the ssb messages that make up the main feed
    pubs: undefined, // becomes populated with an array of the loaded feed messages
    imgCache: new Lru({maxSize: 120}),
    authorCache: new Lru({maxSize: 120}),
  };

  let paginatedQuery = newPaginatedQuery(30);

  emitter.on('DOMContentLoaded', () => {
    emitter.on('navigate', () => {
      if (
        state.ssb && // app is connected
        state.route === '/' // viewing the main feed
      ) {
        emitter.emit('main:load');
      }
    });

    emitter.on('main:load', paginate => {
      // tell the view to render a loading screen
      state.main.loading = true;

      if (paginate === 'next') {
        paginatedQuery.next();
      } else if (paginate === 'prev') {
        paginatedQuery.prev();
      } else if (paginate === 'first') {
        paginatedQuery.reset();
      }

      paginatedQuery.run(state.ssb, (err, msgs) => {
        if (err) {
          throw err;
        }

        // tell the app when loading is done
        emitter.emit('main:loaded', msgs);

        // start loading all the blobs
        msgs.forEach(msg => {
          const id = msg.content.img;
          const author = msg.author;

          if (!state.main.imgCache.has(id)) {
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

          if (!state.main.authorCache.has(author)) {
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
      });
  });

    // transition from loading screen to displaying the feed
    emitter.on('main:loaded', pubs => {
      state.main.loading = false;
      state.main.pubs = pubs;
      emitter.emit('render');
    });

    // display images as their blobs become available
    emitter.on('main:img:loaded', ({id, blob}) => {
      state.main.imgCache.set(id, blob);
      emitter.emit('render');
    });

    // display human-readable author names as they become available
    emitter.on('main:author:loaded', ({id, name}) => {
      state.main.authorCache.set(id, `@${name}`);
      emitter.emit('render');
    });
  });
};
