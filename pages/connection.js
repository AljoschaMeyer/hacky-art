const html = require('choo/html');

const mainPage = require('./main');
const errorPage = require('./error');

module.exports = (state, emit) => {
  switch (state.connection.status) {
    case 'connecting':
      return html`<body><div class="connecting">Connecting to the scuttleverse...</div></body>`;
    case 'connected':
      return mainPage(state, emit);
    case 'error':
      return errorPage(state, emit);
    default:
      return html`<body>You should not see this, the app devs made an error.</body>`;
  }
};
