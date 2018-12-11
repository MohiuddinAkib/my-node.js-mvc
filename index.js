const http = require('http');
const Core = new require('./app/libraries/Core');
const router = require('./routes.js');
const { PUBLICPATH } = require('./app/helpers');
const edge = require('edge.js');
const path = require('path');
const mongoose = require('mongoose');

// Register views
edge.registerViews(path.join(__dirname, './views'));

http
  .createServer((req, res) => {
    // control for favicon
    if (req.url === '/favicon.ico') {
      res.writeHead(200, {
        'Content-Type': `${PUBLICPATH}/image/favicon.ico`
      });
      res.end();
      return;
    }

    // not the favicon? say hai
    new Core(req, res, router);
  })
  .listen(8000, () => {
    console.log('server running on port 8000');
    mongoose.Promise = global.Promise;
    // Monggose connection
    mongoose.connect(
      'mongodb://localhost/test',
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
      }
    );
    // Error handling
    mongoose.connection
      .once('open', () => console.log('DB connection established'))
      .on('error', err => console.log('DB connection error', err));
  });
