const choo = require('choo');
const html = require('choo/html');

// Pages are the top-level views that are associated with routes.
const connectionPage = require('./pages/connection');
const mainPage = require('./pages/main');
const publishPage = require('./pages/publish');

const connectionStore = require('./stores/connection');
const mainStore = require('./stores/main');

const app = choo();

app.use(connectionStore);
app.use(mainStore);

app.route('/', mainPage);
app.route('/connection', connectionPage);
app.route('/publish', publishPage);

app.mount('body');
