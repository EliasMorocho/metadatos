// src/useCases/userUseCase.js
const User = require('../entities/User');

class UserUseCase {
  getUser(userId) {
    // Simulación de obtener un usuario de una base de datos
    return new User(userId, 'John Doe', 'john.doe@example.com');
  }
}

module.exports = UserUseCase;
