const { getBlob, newPaginatedQuery } = require('./ssb-util');

const pageSize = 30;

const newFeed = (pageSize, author) => ({
  loading: true,
  msgs: undefined,
  author: author,
  paginatedQuery: newPaginatedQuery(pageSize, author),
});

const getFeed = (state, author) => {
  if (author) {
    return state.main.authorFeeds.get(author);
  } else {
    return state.main.mainFeed;
  }
};

const getOrCreateFeed = (pageSize, state, author) => {
  const cached = getFeed(state, author);

  if (cached) {
    return cached;
  } else {
    const feed = newFeed(pageSize, author);
    state.main.authorFeeds.set(author, feed);
    return feed;
  }
};

const getAuthor = (cache, ssb, emit, id) => {
  const cached = cache.get(id);
  if (cached) {
    return cached;
  } else {
    ssb.about.socialValue({ key: 'name', dest: id }, (err, name) => {
      if (err) {
        throw err;
      }

      // tell the app when a name has been loaded
      emit('author:loaded', {
        id,
        name,
      });
    });

    return id;
  }
};

const getImg = (cache, ssb, emit, id) => {
  const cached = cache.get(id);
  if (cached) {
    return cached;
  } else {
    getBlob(ssb, id, (err, blob) => {
      if (err) {
        throw err;
      }

      // tell the app when a blob has been loaded
      emit('img:loaded', {
        id,
        blob,
      });
    });

    return undefined;
  }
};

const getMsg = (cache, ssb, emit, id) => {
  const cached = cache.get(id);
  if (cached) {
    return cached;
  } else {
    ssb.get(id, (err, msg) => {
      if (err) {
        throw err;
      }

      // tell the app when a msg has been loaded
      emit('msg:loaded', {
        id,
        msg,
      });
    });

    return undefined;
  }
};

module.exports = {
  pageSize,
  newFeed,
  getFeed,
  getOrCreateFeed,
  getAuthor,
  getImg,
  getMsg,
};
