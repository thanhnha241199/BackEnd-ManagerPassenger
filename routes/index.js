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
router.get('/getuser', actions.getuser)
router.post('/deleteuser', actions.deleteNew)
router.post('/updateuser', actions.updateuser)
router.post('/confirm', actions.confirm)
router.post('/forgetpass', actions.forgetpassword)
router.post('/resetpassword', actions.resetpassword)
router.post('/changepassword', actions.changepassword)
router.post('/updateinfor', actions.updateinfo)
router.post('/authenticate', actions.authenticate)
router.get('/getinfo', actions.getinfo)

//Address
router.post('/addaddress', actions.addAddress)
router.get('/getaddress', actions.getaddress)
router.post('/updateaddress', actions.updateaddress)
router.post('/deleteaddress', actions.deleteaddress)


//Tourbus
router.post('/addtourbus', actions.addtourbus)
router.get('/gettourbus', actions.gettourbus)
router.post('/updateticket', actions.updatetourbus)
router.post('/deleteticket', actions.deletetourbus)

//Chedule
router.post('/addschedule', actions.addchedule)
router.get('/getschedule', actions.getschedule)
router.post('/updateschedule', actions.updatechedule)
router.post('/deleteschedule', actions.deletechedule)


//PickupPoint
router.post('/addpickup', actions.addpickup)
router.get('/getpickup', actions.getpickup)
router.post('/updatepickup', actions.updatePickup)
router.post('/deletepickup', actions.deletePickUp)

//Seat
router.post('/addseat', actions.addseat)
router.get('/getseat', actions.getseat)
router.post('/deleteseat', actions.deleteseat)
router.post('/updateseat', actions.updateseat)

//Order
router.post('/addorder', actions.addorder)
router.get('/getorder', actions.getorder)

//Rental
router.post('/addrental', actions.addrental)
router.get('/getrental', actions.getrental)
router.post('/getrentalorder', actions.getrentalorder)


//Discount
router.post('/adddiscount', actions.adddiscount)
router.get('/getdiscount', actions.getdiscount)
router.post('/updatediscount', actions.updatediscount)
router.post('/deletediscount', actions.deletediscount)

//AddressModel
router.get('/addressmodel', actions.addressmodel)


//Car
router.post('/addcar', actions.addCar)
router.post('/deletecar', actions.deleteCar)
router.post('/updatecar', actions.updateCar)
router.get('/getcar', actions.getCar)


module.exports = router