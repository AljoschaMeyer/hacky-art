const pull = require('pull-stream');
const Lru = require('quick-lru');

const { pageSize, newFeed, getFeed, getOrCreateFeed } = require('../helpers/caching');

module.exports = (state, emitter) => {
  state.main = {
    imgCache: new Lru({maxSize: 120}),
    authorCache: new Lru({maxSize: 120}),
    mainFeed: newFeed(pageSize),
    authorFeeds: new Lru({maxSize: 3}), // map from author ids to objects like `mainFeed`
  };

  emitter.on('DOMContentLoaded', () => {
    emitter.on('feed:load', opts => {
      const feed = getOrCreateFeed(pageSize, state, opts.author);

      feed.loading = true;
      feed.paginatedQuery.run(state.ssb, (err, msgs) => {
        if (err) {
          throw err;
        }

        // tell the app when loading is done
        emitter.emit('feed:loaded', {
          msgs,
          author: opts.author,
        });
      });
    });

    emitter.on('paginate:first', author => {
      getFeed(state, author).paginatedQuery.reset();
      emitter.emit('feed:load', { author });
    });

    emitter.on('paginate:prev', author => {
      getFeed(state, author).paginatedQuery.prev();
      emitter.emit('feed:load', { author });
    });

    emitter.on('paginate:next', author => {
      getFeed(state, author).paginatedQuery.next();
      emitter.emit('feed:load', { author });
    });

    // transition from loading screen to displaying the feed
    emitter.on('feed:loaded', ({ msgs, author }) => {
      const feed = getOrCreateFeed(pageSize, state, author);

      feed.loading = false;
      feed.msgs = msgs;
      emitter.emit('render');
    });

    // display images as their blobs become available
    emitter.on('img:loaded', ({id, blob}) => {
      state.main.imgCache.set(id, blob);
      emitter.emit('render');
    });

    // display human-readable author names as they become available
    emitter.on('author:loaded', ({id, name}) => {
      state.main.authorCache.set(id, `@${name}`);
      emitter.emit('render');
    });
  });
};
