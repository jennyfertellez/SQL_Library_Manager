'use strict';

const Sequelize = require('sequelize');

//Book Model
module.exports = ( sequelize ) => {
  class Book extends Sequelize.Model {}
  Book.init({
    //Model attributes are defined here
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false, //disallow null
      validate: {
        notEmpty: {
          msg: 'Please provide a value for "Title"', //Ensures a TITLE is included
        },
      },
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false, //disallow null
      validate: {
        notEmpty: {
          msg: 'Please provide a value for "Author"', //Ensures an AUTHOR is included
        },
      },
    },
    genre: {
      type: Sequelize.STRING
    },
    year: {
      type: Sequelize.INTEGER
  }, 
}, {sequelize});

  return Book;
};