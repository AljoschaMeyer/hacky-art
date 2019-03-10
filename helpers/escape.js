const escapeKey = key => key.replace(/\//g, '_');
const deescapeKey = esc => esc.replace(/_/g, '/');

module.exports = {
  escapeKey,
  deescapeKey,
};
