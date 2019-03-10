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
  ${publications({
    pubs: state.main.pubs,
    authorCache: state.main.authorCache,
    imgCache: state.main.imgCache,
    ssb: state.ssb,
  }, emit)}
  <nav>
    <button onclick="${onclickPrev}">prev</button>
    <button onclick="${onclickNext}">next</button>
  </nav>
  </body>`;

    function onclickPrev() {
      emit('main:load', 'prev');
    }

    function onclickNext() {
      emit('main:load', 'next');
    }
  }
};
