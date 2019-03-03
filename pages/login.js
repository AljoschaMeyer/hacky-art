const html = require('choo/html');
const Connection = require("ssb-client");

const port = 8989;

module.exports = (state, emit) => {
  const cached = localStorage.getItem('ssb-keys');

  if (cached) {
    try {
      const keys = JSON.parse(cached);
      connect(emit, keys);
      return html`<body></body>`;
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

    const fileInput = document.querySelector('#secret_file');
    const fr = new FileReader();

    fr.onload = function() {
      try {
        const keys = JSON.parse(this.result.replace(/\s*\#[^\n]*/g, '')
        .split('\n').filter(x => !!x).join(''));
        connect(emit, keys);
      } catch (err) {
        emit('secret:error', err);
      }
    }

    try {
      fr.readAsText(fileInput.files[0]);
    } catch (err) {
      emit('secret:error', err);
    }
  }
};

function connect(emit, keys) {
  Connection(keys, {
    manifest: require('../manifest.json'),
    remote: `ws://localhost:${port}/~shs:${keys.public}`,
    caps: {
      shs: "1KHLiKZvAvjbY1ziZEHMXawbCEIM6qwjCDm3VYRan/s=",
      sign: null
    }
  }, (err, server) => {
    if (err) {
      throw err
    } else {
      if (document.querySelector('#autologin').checked) {
        localStorage.setItem('ssb-keys', JSON.stringify(keys));
      }
      emit('login', server);
    }
  })
}

//   <div class="instructions">
//     Please point the browser to your ssb secret file.
//     <input type="file" oninput=${oninput}></input>
//   </div>
// </body>`;

//   function oninput(event) {
//     const fr = new FileReader();
//
//     fr.onload = function() {
//       try {
//         const keys = JSON.parse(this.result.replace(/\s*\#[^\n]*/g, '')
//         .split('\n').filter(x => !!x).join(''));
//
//         Connection(keys, {
//           manifest: require('../manifest.json'),
//           remote: `ws://localhost:${port}/~shs:${keys.public}`,
//           caps: {
//             shs: "1KHLiKZvAvjbY1ziZEHMXawbCEIM6qwjCDm3VYRan/s=",
//             sign: null
//           }
//         }, (err, server) => {
//           if (err) {
//             throw err
//           } else {
//             emit('login', server);
//           }
//         })
//       } catch (e) {
//         emit('secret:error', e);
//       }
//     }
//
//     try {
//       fr.readAsText(event.target.files[0]);
//     } catch (e) {
//       emit('secret:error', e);
//     }
//   }
// };
