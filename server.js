const express = require('express');
const env = require('dotenv').config();
const ejs = require('ejs');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
// Mongoose connection
mongoose.connect('<DB_USERNAME>/<DB_PASSWORD>', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connection Succeeded.');
  })
  .catch((error) => {
    console.log('Error in DB connection: ', error);
  });

const db = mongoose.connection;

// Session configuration
app.use(session({
  secret: 'my secret',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db,
    collection: 'sessions' // specify the name of the collection
  })
}));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Static files middleware
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// Error handler middleware
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log('Server is started on http://127.0.0.1:'+PORT);
});
