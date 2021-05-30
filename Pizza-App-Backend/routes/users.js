const router = require('express').Router()
const {
    readUser,
    createUser,
    loginUser,
    emailChecker } = require('../controllers/usersController')

router.get('/api/users/:id', readUser)
router.post('/api/users/signup', createUser)
router.post('/api/users/login', loginUser)

//To Check if Email is Already There in Database
router.post('/api/users/email', emailChecker)
module.exports = router