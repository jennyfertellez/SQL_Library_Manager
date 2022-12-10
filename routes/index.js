var createError = require('http-errors');
var express = require('express');
var router = express.Router();

//Import Book Model
var Book = require('../models').Book;

//Handler function to wrap each route. (Middleware)
function asyncHandler(cb) {
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error) {
      next(error);
    }
  }
}

//Home route redirecting to the /books rroute
router.get('/', asyncHandler(async (req, res) => {
  res.redirect('/books')
}));

//Shows the full list of books and stores them in a variable
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll({ order: [['createdAt', 'DESC']] });
  res.render('index', { books, title: 'Library Books' });
}));

//Create a new book form 
router.get('/books/new', asyncHandler(async (req, res) => {
  res.render("new-book");
}));

//Posts a new book to the database
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/');
    //Checks the error
  } catch (error) { 
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      res.render("new-book", { book, errors: error.errors})
    } else {
      throw error;
    }
  }
}));

//Shows book detail form
router.get('/books/:id', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("update-book", { book, title: book.title});
  } else {
    const error = new Error("We apologize, but the book you are searching for is not in our database.");
    error.status = 404;
    next(error);
  }
}));

//Updates book info in the databse
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/');
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; //makes sure correct book is posted
      res.render("update-book", { book, errors: error.errors })
    } else {
      throw error;
    }
  }
}));

//Deletes a book
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect('/books');
  } else {
    res.sendStatus(404);
  }
}));

module.exports = router;