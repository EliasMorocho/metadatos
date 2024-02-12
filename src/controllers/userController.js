// src/controllers/userController.js
const express = require('express');
const bodyParser = require('body-parser');
const UserUseCase = require('../useCases/userUseCase');

const userController = express.Router();
const jsonParser = bodyParser.json();
const userUseCase = new UserUseCase();

userController.get('/user/:userId', jsonParser, (req, res) => {
  const userId = req.params.userId;
  const user = userUseCase.getUser(userId);

  res.json(user);
});

module.exports = userController;
