// Options

const STATIC_DIR = 'public';
const PORT = 3000;
const TEMPLATE_FILE = 'package/template.yaml';
const CWD = process.cwd();

// Load environment variables

const dotenv = require('dotenv');
dotenv.config();

// Initialize Express app

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static(STATIC_DIR));
app.listen(PORT);

// Mount routes to handlers

const { join } = require('path');
const mockLambdaProxy = require('./mockLambdaProxy');
const parseRoutes = require('./parseRoutes');

parseRoutes(TEMPLATE_FILE)
  .then(routes => {
    let requires = {};

    routes.forEach(route => {
      const [handlerFile, handlerFn] = route.handler.split('.');
      const method = route.method.toLowerCase();
      const path = route.path;

      if (!requires[handlerFile]) {
        requires[handlerFile] = require(join(CWD, handlerFile));
      }

      app[method](path, mockLambdaProxy(requires[handlerFile][handlerFn]));
    });
  });
