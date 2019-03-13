const escapeKey = key => key.replace(/\//g, '_');
const deescapeKey = esc => esc.replace(/_/g, '/');
const escapeMsg = key => key.replace(/\//g, '_').replace('%', '~');
const deescapeMsg = esc => esc.replace('~', '%').replace(/_/g, '/');

module.exports = {
  escapeKey,
  deescapeKey,
  escapeMsg,
  deescapeMsg,
};
