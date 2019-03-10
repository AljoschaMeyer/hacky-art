const html = require('choo/html');

module.exports = (state, emit) => {
  return html`<nav class="pagination">
  <button onclick="${onclickFirst}" class="paginateFirst">first</button>
  <button onclick="${onclickPrev}" class="paginatePrev">prev</button>
  <button onclick="${onclickNext}" class="paginateNext">next</button>
</nav>`;

  function onclickFirst() {
    emit('paginate:first', state.author);
  }

  function onclickPrev() {
    emit('paginate:prev', state.author);
  }

  function onclickNext() {
    emit('paginate:next', state.author);
  }
};
