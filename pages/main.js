const html = require('choo/html');

const nav = require('../views/nav');
const publications = require('../views/publications');

module.exports = (state, emit) => {
  if (state.main.loading) {
    return html`<body>
  ${nav()}
  Loading...
</body>`;
  } else {
    return html`<body>
  ${nav()}
  ${publications(state, emit)}
  </body>`;
  }
}
