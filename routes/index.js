var express = require('express');
var router = express.Router();

//Import Book Model
var { Book } = require('../models');
var book = require('../models/book').default;

//Handler function to wrap each route.
function asyncHandler(cb) {
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error) {
      next(error);
    }
  }
}
/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
});

module.exports = router;

//Create a new book form 
router.get('/books/new', (req, res) => {
  res.render("books/new-book", { book: {}, title: "Add A New Book"});
})