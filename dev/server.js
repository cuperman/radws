// Options

const STATIC_DIR = 'public';
const ROOT_DIR = process.cwd();
const TEMPLATE_FILE = 'package/template.yaml';
const API_EXPLORER = true;
const PORT = 3000;

// Load environment variables

const dotenv = require('dotenv');
dotenv.config();

// Initialize Express app

const express = require('express');
const bodyParser = require('body-parser');
var mustache = require('mustache-express');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(STATIC_DIR));
app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));
app.listen(PORT);

// Parse routes

const parseRoutes = require('./parseRoutes');
const routes = parseRoutes(TEMPLATE_FILE);

// API Explorer

if (API_EXPLORER) {
  const apiExplorer = require('./apiExplorer')(routes);
  app.get('/api_explorer', apiExplorer);
}

// Mount routes to handlers

const { join } = require('path');
const expressifyPath = require('./expressifyPath');
const { mockLambdaProxy } = require('./mockLambda');

let requires = {};
routes.forEach(route => {
  const [handlerFile, handlerFn] = route.handler.split('.');
  const method = route.method.toLowerCase();
  const path = expressifyPath(route.path);

  if (!requires[handlerFile]) {
    requires[handlerFile] = require(join(ROOT_DIR, handlerFile));
  }

  app[method](path, mockLambdaProxy(requires[handlerFile][handlerFn]));
});
