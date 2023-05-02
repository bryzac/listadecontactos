require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const usersRouter = require('./controllers/users');
const verifyRouter = require('./controllers/verify');
const loginRouter = require('./controllers/login');
const resetPasswordRouter = require('./controllers/resetPassword');
const contactRouter = require('./controllers/contacts');
const { userExtractor } = require('./middleware/auth');
const logoutRouter = require('./controllers/logout');
const { MONGO_URI } = require('./config');
const conchaleRouter = require('./controllers/conchale');

(async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.log(error);
    }
})();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Rutas frontend
app.use('/', express.static(path.resolve('views', 'home')));
app.use('/styles', express.static(path.resolve('views', 'styles')));
app.use('/signup', express.static(path.resolve('views', 'signup')));
app.use('/login', express.static(path.resolve('views', 'login')));
app.use('/verify/:id/:token', express.static(path.resolve('views', 'verify')));
app.use('/resetPassword', express.static(path.resolve('views', 'resetPassword')));
app.use('/resetPassword/:token', express.static(path.resolve('views', 'resetPassword')));
app.use('/listaContactos', express.static(path.resolve('views', 'listaContactos')));
app.use('/components', express.static(path.resolve('views', 'components')));
app.use('/images', express.static(path.resolve('img')));

app.use(morgan('tiny'));

// Rutas backend
app.use('/api/users', usersRouter);
app.use('/api/users/verify', verifyRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/resetPassword', resetPasswordRouter);
app.use('/api/contacts', userExtractor, contactRouter);

app.use('/api/conchale', userExtractor, conchaleRouter);

module.exports = app;