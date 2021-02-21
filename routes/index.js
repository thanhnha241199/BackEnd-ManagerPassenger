const express = require('express')
const actions = require('../methods/actions')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('Hello World')
})

router.get('/dashboard', (req, res) => {
    res.send('Dashboard')
})


router.post('/adduser', actions.addNew)
router.post('/confirm', actions.confirm)
router.post('/forgetpass', actions.forgetpassword)
router.post('/changepass', actions.changepassword)

router.post('/authenticate', actions.authenticate)

router.get('/getinfo', actions.getinfo)

module.exports = router