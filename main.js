const choo = require('choo');
const html = require('choo/html');

// Pages are the top-level views that are associated with routes.
const connectionPage = require('./pages/connection');
const feedPage = require('./pages/feed');
const publishPage = require('./pages/publish');
// const previewPage = require('./pages/preview');
const userPage = require('./pages/user');

const connectionStore = require('./stores/connection');
const feedStore = require('./stores/feed');
// const publishStore = require('./stores/publish');

const app = choo();

app.use(connectionStore);
app.use(feedStore);
// app.use(publishStore);

app.route('/', feedPage);
app.route('/connection', connectionPage);
app.route('/publish', publishPage);
// app.route('/preview', previewPage);
app.route('/user/:user', userPage);

app.mount('body');
