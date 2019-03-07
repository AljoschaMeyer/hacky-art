const html = require('choo/html');

module.exports = (state, emit) => {
  const cached = localStorage.getItem('ssb-keys');

  if (cached) {
    try {
      const keys = JSON.parse(cached);
      emit('login:connect', keys);
      return html`<body>Logging in...</body>`;
    } catch (e) {
      emit('secret:error', e);
    }
  } else {
    return html`<body>
  <form class="login" onsubmit=${onsubmit}>
    <label for="secret-file">Select your ssb secret file</label>
    <input id="secret_file" name="secret-file" type="file" required>
    <label for="autologin">Stay logged in</label>
    <input type="checkbox" id="autologin" name="autologin" checked>
    <label for="login">Login</label>
    <input type="submit" name="login" value="Login" checked>
  </form>
</body>`;
  }

  function onsubmit(event) {
    event.preventDefault();
    console.log('emitted event');
    emit('login:connect', null);

    // const fileInput = document.querySelector('#secret_file');
    // const fr = new FileReader();
    //
    // fr.onload = function() {
    //   try {
    //     const keys = JSON.parse(this.result.replace(/\s*\#[^\n]*/g, '')
    //     .split('\n').filter(x => !!x).join(''));
    //     emit('login:connect', keys);
    //   } catch (err) {
    //     emit('secret:error', err);
    //   }
    // }
    //
    // try {
    //   fr.readAsText(fileInput.files[0]);
    // } catch (err) {
    //   emit('secret:error', err);
    // }
  }
};
