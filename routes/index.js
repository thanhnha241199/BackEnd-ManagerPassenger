const express = require('express')
const actions = require('../methods/actions')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('Hello World')
})

router.get('/dashboard', (req, res) => {
    res.send('Dashboard')
})

//Users
router.post('/adduser', actions.addNew)
router.post('/confirm', actions.confirm)
router.post('/forgetpass', actions.forgetpassword)
router.post('/resetpassword', actions.resetpassword)
router.post('/changepassword', actions.changepassword)
router.post('/updateinfor', actions.updateinfo)
router.post('/authenticate', actions.authenticate)
router.get('/getinfo', actions.getinfo)

//Address
router.post('/addaddress', actions.addAddress)
router.post('/getaddress', actions.getaddress)
router.post('/updateaddress', actions.updateaddress)
router.post('/deleteaddress', actions.deleteaddress)


//Tourbus
router.post('/addtourbus', actions.addtourbus)
router.post('/gettourbus', actions.gettourbus)

module.exports = router