// src/controllers/pageController.js
const express = require('express');
const path = require('path');
const pageController = express.Router();

pageController.get('/', (req, res) => {
  res.render('index'); 
});
pageController.get('/:inputString', (req, res) => {
  const inputString = req.params.inputString;
  const responseObject = {
    result: `You provided the string: ${inputString}`
  };
  res.json(responseObject);
});

module.exports = pageController;
