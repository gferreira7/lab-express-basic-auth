const { Router } = require('express')
const router = new Router()

const mongoose = require('mongoose') // <== has to be added

const bcryptjs = require('bcryptjs')
let saltRounds = 10

const User = require('../models/User.model')

router.get('/signup', (req, res, next) => {
  res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        password: hashedPassword,
      })
    })
    .then((userFromDB) => {
      console.log('Newly created user is: ', userFromDB)
      res.redirect('/')
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/signup')
      } else if (error.code === 11000) {
        res.status(500).render('auth/signup')
      } else {
        next(error)
      }
    })
})

router.get('/login', (req, res) => res.render('auth/login'))

router.post('/login', (req, res, next) => {
  const { username, password } = req.body

  User.findOne({ username }) // <== check if there's user with the provided username
    .then((user) => {
      // <== "user" here is just a placeholder and represents the response from the DB
      if (!user) {
        // <== if there's no user with provided email, notify the user who is trying to login
        res.render('auth/login')
        return
      }
      // if there's a user, compare provided password
      // with the hashed password saved in the database
      else if (bcryptjs.compareSync(password, user.password)) {
        req.session.currentUser = user
        res.redirect('/')
      } else {
        // if the two passwords DON'T match, render the login form again
        // and send the error message to the user
        res.render('auth/login')
      }
    })
    .catch((error) => next(error))
})

module.exports = router
