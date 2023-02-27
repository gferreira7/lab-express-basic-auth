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
      console.log("Newly created user is: ", userFromDB);
      res.redirect('/')
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/signup', { errorMessage: error.message })
      } else if (error.code === 11000) {
        res.status(500).render('auth/signup', {
          errorMessage:
            'Username needs to be unique. Username is already used.',
        })
      } else {
        next(error)
      }
    })
  

})
module.exports = router
