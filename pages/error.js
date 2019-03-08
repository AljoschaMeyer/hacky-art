const html = require('choo/html');

module.exports = (state, emit) => {
  return html`<body>
  <div class="error">
    <p>An error occured. There's no need to panic. You can refresh the page (<code>ctrl + r</code>) to try to connect to the scuttleverse again.</p>
    <p>Here's the error in all its glory:</p>
  <div class="err">
    ${state.connection.err}
  </div>
  </div>
</body>`;
};
