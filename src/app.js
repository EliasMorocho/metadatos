// app.js
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const bodyParser = require('body-parser');
const userController = require('./controllers/userController');
const pageController = require('./controllers/pageController');
const youtubeController = require('./controllers/youtubeController');
const authController = require('./controllers/authController');

const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesión
app.use(session({
    secret: crypto.randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: true,
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware de autenticación global utilizando Passport
// Middleware de autenticación
app.use((req, res, next) => {
    // Verifica si el usuario está autenticado
    if (req.isAuthenticated() || req.path === '/auth/login' || req.path.startsWith('/api')) {
        return next();
    } else {
        // Si no está autenticado y no es la ruta de inicio de sesión, redirige a la página de inicio de sesión
        res.redirect('/auth/login');
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Aplica el controlador de autenticación a las rutas específicas
app.use('/auth', authController);

// Resto de tus controladores
app.use('/api', userController);
app.use('/', pageController);
app.use('/api', youtubeController);

app.use((req, res) => {
    res.status(404).render('notFound');
});

app.listen(port, () => {
    console.log(`La API está escuchando en http://localhost:${port}`);
});
