//Required Imports
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bp = require("body-parser");

var app = express();

//Import Routes Path
var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');

//Import Sequelize
const { sequelize } = require('./models');

//Sequelize Authenticate to ensure there is a connection and the model is sync
sequelize.authenticate()
  .then(() => {
    console.log("Connection established successfully.");
    return sequelize.sync()
  })
  .then(() => {
    console.log("Model successfully sync with database.")
  })
  .catch(err => {
    console.log("Unable to connect to database.", err);
  })

//View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Static Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(bp.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));

//Modules
app.use('/', indexRouter);


//Catch 404 and Forward to Error Handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;

  next(err);
});

//Global Error Handler
app.use(function(err, req, res, next) {
  if (err.status === 404) {
    res.status(404);
    res.render("page-not-found", { err, title: "Page Not Found"});
    console.log("404 Error");
  } else {
    err.message = err.message || `Sorry! Server Not Found`;
    res.status(err.status || 500)
    res.render('error', { err });
  }
});

//Start Up The Server
app.listen(3000, function() {
  console.log("Server started on Port 3000");
})

module.exports = app;
