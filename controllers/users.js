const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const AlreadyUseError = require('../errors/AlreadyUseError');
const IncorrectDataError = require('../errors/IncorrectDataError');

const getCurrentUser = (req, res, next) => User.findById(req.user._id)
  .orFail(() => {
    throw new NotFoundError('Нет пользователя с таким id');
  })
  .then((user) => res.send(user))
  .catch(next);

const createUser = (req, res, next) => {
  bcrypt
    .hash(String(req.body.password), 10)
    .then((hashedPass) => {
      User.create({
        ...req.body,
        password: hashedPass,
      })
        .then((newUser) => res.status(201).send(newUser))
        .catch((err) => {
          if (err.code === 11000) {
            next(
              new AlreadyUseError('Пользователь с такой почтой уже существует'),
            );
          } else if (err.name === 'ValidationError') {
            next(
              new IncorrectDataError(
                'Неверные данные при создании пользователя',
              ),
            );
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .orFail(() => {
      throw new UnauthorizedError('Неверная почта или пароль');
    })
    .then((user) => {
      bcrypt
        .compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const jwt = jsonWebToken.sign(
              {
                _id: user._id,
              },
              NODE_ENV === 'production' ? JWT_SECRET : 'dev-mega-secret',
              { expiresIn: '7d' },
            );
            res.cookie('jwt', jwt, {
              maxAge: 360000,
              httpOnly: true,
              sameSite: true,
            });
            res.send({ data: user.toJSON() });
          } else {
            throw new UnauthorizedError('Неверная почта или пароль');
          }
        })
        .catch(next);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new IncorrectDataError(
            'Некорректные данные при обновлении информации',
          ),
        );
      } else {
        next(err);
      }
    });
};

const logout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Вы успешно разлогинились' });
};

module.exports = {
  createUser,
  updateUser,
  login,
  getCurrentUser,
  logout,
};
