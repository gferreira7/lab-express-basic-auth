const { Router } = require('express');
const router = new Router();

router.get('/signup', (req, res, next) => {
  res.render('auth/signup')
})

module.exports = router