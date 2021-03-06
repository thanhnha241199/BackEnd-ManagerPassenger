const express = require("express");
const actions = require("../methods/actions");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.get("/dashboard", (req, res) => {
  res.send("Dashboard");
});

//Users
router.post("/adduser", actions.addNew);
router.get("/getuser", actions.getuser);
router.post("/deleteuser", actions.deleteNew);
router.post("/updateuser", actions.updateuser);
router.post("/confirm", actions.confirm);
router.post("/forgetpass", actions.forgetpassword);
router.post("/resetpassword", actions.resetpassword);
router.post("/changepassword", actions.changepassword);
router.post("/updateinfor", actions.updateinfo);
router.post("/authenticate", actions.authenticate);
router.get("/getinfo", actions.getinfo);
router.post("/updateRatingUser", actions.updateRatingUser);

//Address
router.post("/addaddress", actions.addAddress);
router.get("/getaddress", actions.getaddress);
router.post("/updateaddress", actions.updateaddress);
router.post("/deleteaddress", actions.deleteaddress);

//NotificationActive
router.post("/notificationActive", actions.addActive);
router.get("/notificationActive", actions.getActive);
router.put("/notificationActive", actions.updateActive);
router.delete("/notificationActive", actions.deleteActive);

//Tourbus
router.post("/addtourbus", actions.addtourbus);
router.get("/gettourbus", actions.gettourbus);
router.post("/updateticket", actions.updatetourbus);
router.post("/deleteticket", actions.deletetourbus);
router.post("/updateRatingtourbus", actions.updateRatingtourbus);

//Chedule
router.post("/addschedule", actions.addchedule);
router.get("/getschedule", actions.getschedule);
router.post("/updateschedule", actions.updatechedule);
router.post("/deleteschedule", actions.deletechedule);

//PickupPoint
router.post("/addpickup", actions.addpickup);
router.get("/getpickup", actions.getpickup);
router.post("/updatepickup", actions.updatePickup);
router.post("/deletepickup", actions.deletePickUp);

//Seat
router.post("/addseat", actions.addseat);
router.get("/getseat", actions.getseat);
router.post("/deleteseat", actions.deleteseat);
router.post("/updateseat", actions.updateseat);
router.post("/updateOrderseat", actions.updateOrderseat);

//Card
router.post("/addcard", actions.addcard);
router.post("/sendmail", actions.sendorder);
router.post("/deletecard", actions.deletecard);
router.post("/getcard", actions.getcard);
router.post("/updateStatusorder", actions.updateStatusorder);

//Order
router.post("/addorder", actions.addorder);
router.get("/getorder", actions.getorder);
router.get("/getorderuser", actions.getorderuser);

//Rental
router.post("/addrental", actions.addrental);
router.get("/getrental", actions.getrental);
router.post("/getrentalorder", actions.getrentalorder);

//Notification
router.post("/addnoti", actions.addNoti);
router.get("/getnoti", actions.getNoti);
router.post("/sendnoti", actions.sendNoti);
router.get("/sendnoti", actions.sendNotiGet);

//Discount
router.post("/adddiscount", actions.adddiscount);
router.get("/getdiscount", actions.getdiscount);
router.post("/updatediscount", actions.updatediscount);
router.post("/deletediscount", actions.deletediscount);

//AddressModel
router.get("/addressmodel", actions.addressmodel);

//Car
router.post("/addcar", actions.addCar);
router.post("/deletecar", actions.deleteCar);
router.post("/updatecar", actions.updateCar);
router.get("/getcar", actions.getCar);

// Dashboard
router.get("/getDashboard", actions.dashboard);
router.post("/updateOrder", actions.updateOrder);

module.exports = router;
