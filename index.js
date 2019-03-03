const choo = require('choo');
const html = require('choo/html');

// Pages are the top-level views that are asociated with routes.
const loginPage = require('./pages/login');
const mainPage = require('./pages/main');
const publishPage = require('./pages/publish');

const loginStore = require('./stores/login');
const mainStore = require('./stores/main');

const app = choo();

app.use(loginStore);
app.use(mainStore);

app.route('/', loginPage);
app.route('/publish', publishPage);

app.mount('body');
