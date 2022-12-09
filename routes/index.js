var express = require('express');
var router = express.Router();

//Import Book Model
var { Book } = require('../models');
var book = require('../models/book').default;

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
router.get('/books/new', (req, res) => {
  res.render("books/new-book", { book: {}, title: "Add A New Book"});
});

//Posts a new book to the database
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/');
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      res.render("books/new-book", { book, errors: error.errors, title: "Add A New Book" })
    } else {
      throw error;
    }
  }
}));

//Shows book detail form
router.get('/books/:id', asyncHandler(async (req, res, next) => {
  res.render("books/update-book", { book, title: book.title});
}))

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