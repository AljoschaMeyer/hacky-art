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

// Return an object that allows paginated queries for `tamaki:post` messages,
// sorted by claimed timestamp. If `author` not undefined, only messages by that
// author (public key) are returned.
//
// This returns an object with four methods:
// - `run`: takes a callback and calls it with the result of the current query
// - `next`: advance the query that will be executed by `run` by one page
// - `prev`: decrease the query that will be executed by `run` by one page
// - `reset`: move the query back to the beginning of the log
const newPaginatedQuery = (pageSize, author) => {
  const defaultQuery = () => ({
    limit: pageSize,
    reverse: true,
    query: [
      {
        $filter: {
          value: {
            content: { type: 'tamaki:publication' },
            author,
            timestamp: { $gte: 0 }
          }
        }
      }
    ]
  });

  let q; // the ssb-query query object
  let currentTimestamp; // ts of the first msg on the page
  let nextTimestamp; // ts of the last msg on the page
  let prevTimestampStack; // stack of previous `currentTimestamp`s
  reset();

  function run(ssb, cb) {
    return pull(
      ssb.query.read(q),
      pull.collect((err, msgs) => {
        if (err) {
          cb(err);
        }

        if (msgs.length > 0) {
          currentTimestamp = msgs[0].timestamp;
          nextTimestamp = msgs[msgs.length - 1].timestamp;
          return cb(null, msgs.map(msg => {
            const ret = msg.value;
            ret.msgId = msg.key;
            return ret;
          }));
        } else {
          // query returned no results
          if (q.query[0].$filter.value.timestamp.$gte === 0) {
            // There are no query results at all.
            return cb(null, msgs);
          } else {
            // We reached the end of pagination, paginate back and try again.
            prev();
            return run(ssb, cb);
          }
        }
      })
    );
  }

  function next() {
    q.query[0].$filter.value.timestamp = { $lt: nextTimestamp };
    prevTimestampStack.push(currentTimestamp);
  }

  function prev() {
    const ts = prevTimestampStack.pop();

    if (prevTimestampStack.length === 0) {
      reset();
    } else {
      q.query[0].$filter.value.timestamp = { $lte: ts };
    }
  }

  function reset() {
    q = defaultQuery();
    currentTimestamp = undefined;
    nextTimestamp = 0;
    prevTimestampStack = [];
  }

  return {
    run,
    next,
    prev,
    reset,
  };
};

module.exports = {
  getBlob,
  newPaginatedQuery,
};
