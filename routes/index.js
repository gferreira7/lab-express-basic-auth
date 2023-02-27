const { isLoggedIn } = require('../middleware/route-guard.js')

const router = require('express').Router()

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index')
})

router.get('/main', (req, res, next) => {
  res.render('main')
})

router.get('/private', isLoggedIn, (req, res, next) => {
  res.render('private')
})

module.exports = router
