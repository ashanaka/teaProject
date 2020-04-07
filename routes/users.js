const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');


// Load User Model
require('../models/User');
const User = mongoose.model('users');

// User Register Route
router.get('/add', (req, res) => {
  res.render('users/add');
});
// Register Form POST
router.post('/register', (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({ text: 'Passwords do not match' });
  }

  if (req.body.password.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters' });
  }

  if (errors.length > 0) {
    res.render('users/add', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2,
      amountPerKG: req.body.amountPerKG
    });
  } else {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          req.flash('error_msg', 'Email already regsitered');
          res.redirect('/users/add');
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            amountPerKG: req.body.amountPerKG
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered and can log in');
                  res.redirect('/users/login');
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      });
  }
});

// Edit User PUT process
router.put('/edit/:id', (req, res) => {
  User.findOne({
      _id: req.params.id
  })
      .then(user => {
          // new values
          user.name = req.body.name;
          user.email = req.body.email;
          user.amountPerKG = req.body.amountPerKG;

          user.save()
              .then(user => {
                  req.flash('success_msg', 'User data updated');
                  res.redirect('/');
              })
      });
});
// Edit User Form
router.get('/edit/:id', (req, res) => {
  User.findOne({
      _id: req.params.id
  })
      .then(user => {
          if (user.id != req.user.id) {
              req.flash('error_msg', 'Not Authorized');
              res.redirect('/employees');
          } else {
              res.render('users/edit', {
                  user: user
              });
          }

      });
});

// User Login Route
router.get('/login', (req, res) => {
  res.render('users/login');
});
// Login Form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});


// Logout User
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;