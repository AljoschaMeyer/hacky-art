// TODO implement this (these should convert to/from url-safe keys)
const escapeKey = key => {
  // TODO use the built-in method...
  let old = key;
  let next = old.replace('/', '_');

  while (old != next) {
    old = next;
    next = next.replace('/', '_');
  }

  return next;
}
const deescapeKey = esc => {
  // TODO use the built-in method...
  let old = esc;
  let next = old.replace('_', '/');

  while (old != next) {
    old = next;
    next = next.replace('_', '/');
  }

  return next;
}

module.exports = {
  escapeKey,
  deescapeKey,
};
