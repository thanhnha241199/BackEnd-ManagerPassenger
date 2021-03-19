var User = require('../models/user')
var Address = require('../models/address')
var Tourbus = require('../models/tourbus')
var Schedule = require('../models/chedule')
var Car = require('../models/car')
var PickupPoint = require('../models/pickuppoint')
var Order = require('../models/order')
var Seat = require('../models/seat')
var jwt = require('jwt-simple')
var config = require('../config/dbconfig')
var mailgun = require("mailgun-js")
var DOMAIN = 'sandboxb25e2fc7cf984723b32c0fec7547984e.mailgun.org'
var mg = mailgun({apiKey: '3fc8dfdd8323144c34284eb76b5d5ba1-d32d817f-2f5bf026', domain: DOMAIN})
var lodash = require('lodash')
var bcrypt = require('bcrypt')
const { use } = require('passport')
var mongoose = require('mongoose')
var functions = {
    addNew: function (req, res) {
        if ((!req.body.email) || (!req.body.password) || (!req.body.name) || (!req.body.phone)|| (!req.body.type)) {
            console.log(req.body)
            res.json({success: false, msg: 'Enter all fields'})
        }
        else {
            var newUser = User({
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
                phone: req.body.phone,
                image:"",
                type: req.body.type
            })
            newUser.save(function (err, newUser) {
                if (err) {
                    res.json({success: false, msg: 'Failed to save'})
                }
                else {
                    res.json({success: true, msg: 'Successfully saved'})
                }
            })
        }
    },
    deleteNew: function (req, res) {
        User.findByIdAndDelete( {_id: req.body.id}, function(err, user){
            if(err || !user){
                res.status(403).send({success: false, msg: 'Not found'})
            }
            else
            {
                return res.json({success: true, msg: 'success'})
            }
        })
    },
    confirm: function (req, res) {
        if ((!req.body.email) || (!req.body.password) || (!req.body.name) || (!req.body.phone)) {
            console.log(req.body)
            res.json({success: false, msg: 'Enter all fields'})
        }
        else {
            User.findOne({
                email: req.body.email
            }, function (err, user) {
                    if (err) throw err
                    if (!user) {
                        var OTP = Math.floor(1000 + Math.random() * 9000)
                        const data = {
                            from: 'noreply@hello.com',
                            to: 'huynhthanhnha24111999@gmail.com',
                            subject: 'Hello',
                            text: `OTP: ${OTP}`
                        }
                        mg.messages().send(data, function (error, body) {
                            res.json({success: true, msg: 'Confirm Successfully', otp: OTP})
                        })
                    }
                    else {
                            return res.status(400).send({success: false, msg: 'Email existed!'})
                        }
                    })
            }
    },
    authenticate: function (req, res) {
        User.findOne({
            email: req.body.email
        }, function (err, user) {
                if (err) throw err
                if (!user) {
                    res.status(403).send({success: false, msg: 'Authentication Failed, User not found'})
                }

                else {
                    user.comparePassword(req.body.password, function (err, isMatch) {
                        if (isMatch && !err) {
                            var token = jwt.encode(user._id, config.secret)
                            user.token = token
                            user.save()
                            res.json(
                                {
                                    success: true, 
                                    token: token,
                                    type: user.type,
                                    email: user.email,
                                    name: user.name,
                                    id: user._id
                                })
                        }
                        else {
                            return res.status(403).send({success: false, msg: 'Authentication failed, wrong password'})
                        }
                    })
                }
        }
        )
    },
    getinfo: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedtoken = jwt.decode(token, config.secret)
            User.findById({_id: decodedtoken}, function(err,user){
                if(err || !user){
                    res.status(403).send({success: false, msg: 'ID not found'})
                }
                else{
                    return res.json({
                        success: true,
                        msg: 'Successfull', 
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        image: user.image,
                        _id: user._id
                     })
                }
            })
        }
        else {
            return res.json({success: false, msg: 'No Headers'})
        }
    },
    forgetpassword: function(req, res) {
        console.log(req.body.email)
        User.findOne({
            email: req.body.email
        }, function(err, user) {
            if (err || !user) {
                return res.status(400).send({
                    success: false,
                    msg: 'Email does not existed!'
                })
            }
            var OTP = Math.floor(1000 + Math.random() * 9000)
            const data = {
                from: 'noreply@hello.com',
                to: 'huynhthanhnha24111999@gmail.com',
                subject: 'Hello',
                text: `OTP: ${OTP}`
            }
    
            return user.updateOne({
                email: req.body.email
            }, function (err, success){
                if (err) {
                    res.status(400).json({
                        error: 'Forget password failed'
                    })
                } else {
                    mg.messages().send(data, function (err, body) {
                        if (err) {
                            return res.json({
                                success: false,
                                error: err.messages
                            })
                        }
                        return res.json({
                            success: true,
                            messages: 'Message has been sent Email',
                            otp: OTP
                        })
                    })
    
                }
            })
        })
    },
    resetpassword: function(req, res) {
        User.findOne({email: req.body.email},function(err, user){
            if(err || !user){
                res.json({success: false, msg: 'Email failed'})
            }
            else{
                var password = req.body.password
                bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                var query = {'email': req.body.email};
                User.findOneAndUpdate(query, { password: hash}, {upsert: true}, function(err, doc) {
                    if (err) return res.send(500, {error: err});
                    doc.save(function (err, newPass) {
                        if (err) {
                            res.json({success: false, msg: 'Failed to save'})
                        }
                        else {
                            res.json({success: true, msg: 'Successfully saved'})
                        }
                            })
                        })
                    })
                })
            }
        })
    },
    changepassword: function(req, res) {
        User.findOne({
            email: req.body.email
        }, function (err, user) {
                if (err) throw err
                if (!user) {
                    res.status(403).send({success: false, msg: 'Authentication Failed, User not found'})
                }
                else {
                    user.comparePassword(req.body.oldpassword, function (err, isMatch) {
                        if (isMatch && !err) {
                            var password = req.body.newpassword
                            bcrypt.genSalt(10, function(err, salt) {
                                bcrypt.hash(password, salt, function(err, hash) {
                                var query = {'email': req.body.email};
                                User.findOneAndUpdate(query, { password: hash}, {upsert: true}, function(err, doc) {
                                    if (err) return res.send(500, {error: err});
                                    doc.save(function (err, newPass) {
                                        if (err) {
                                            res.json({success: false, msg: 'Failed to save'})
                                        }
                                        else {
                                            res.json({success: true, msg: 'Successfully saved'})
                                        }
                                            })
                                        })
                                    })
                                })
                        }
                        else {
                            return res.status(403).send({success: false, msg: 'Authentication failed, wrong password'})
                        }
                    })
                }
        }
        )
    },
    updateinfo: function(req, res){
        var query = { _id: req.body._id}
        User.findOneAndUpdate(query, { name: req.body.name, phone: req.body.phone, image: req.body.image}, {upsert: true}, function(err, doc) {
            if (err) return res.send(500, {error: err});
            doc.save(function (err, newPass) {
                if (err) {
                    res.json({success: false, msg: 'Failed to save'})
                }
                else {
                    res.json({success: true, msg: 'Successfully saved'})
                }
                    })
                })
    },
    updateuser: function(req, res){
        var query = { _id: req.body.id}
        User.findOneAndUpdate(query, { name: req.body.name, phone: req.body.phone, email: req.body.email, type: req.body.type}, {upsert: true}, function(err, doc) {
            if (err) return res.send(500, {error: err});
            doc.save(function (err, newPass) {
                if (err) {
                    res.json({success: false, msg: 'Failed to save'})
                }
                else {
                    res.json({success: true, msg: 'Successfully saved'})
                }
                    })
                })
    },
    addAddress: function (req, res) {
        if ((!req.body.id) || (!req.body.title) || (!req.body.address)) {
            console.log(req.body)
            res.json({success: false, msg: 'Enter all fields'})
        }
        else {
            var newAddress = Address({
                title: req.body.title,
                address: req.body.address,
                uid: req.body.id
            })
            newAddress.save(function (err, newUser) {
                if (err) {
                    res.json({success: false, msg: 'Failed to save'})
                }
                else {
                    res.json({success: true, msg: 'Successfully saved'})
                }
            })
        }
    },
    getaddress: function (req, res) {
        var id = req.query.uid;
        if(id){
            Address.find({uid: id}, function(err, address){
                if(err || !address){
                    res.status(403).send({success: false, msg: 'Not found'})
                }else{
                    return res.json(address)
                }
            })
        }else{
            Address.find({}, function(err, address){
                if(err || !address){
                    res.status(403).send({success: false, msg: 'Not found'})
                }else{
                    return res.json(address)
                }
            })
        }
    },
    updateaddress: function (req, res) {
        Address.findByIdAndUpdate( {_id: req.body.id},{title: req.body.title, address: req.body.address}, function(err, address){
            if (err) return res.send(500, {error: err});
            if(!address){
                res.status(403).send({success: false, msg: 'Not found'})
            }
            else
            {
                address.save(function (err, newPass) {
                    if (err) {
                        res.json({success: false, msg: 'Failed to save'})
                    }
                    else {
                        res.json({success: true, msg: 'Successfully saved'})
                    }
                        })
            }
        })
    },
    deleteaddress: function (req, res) {
        Address.findByIdAndDelete( {_id: req.body.id}, function(err, address){
            if(err || !address){
                res.status(403).send({success: false, msg: 'Not found'})
            }
            else
            {
                return res.json({success: true, msg: 'success'})
            }
        })
    },
    addtourbus: function (req, res) {
        if ((!req.body.locationstart) || (!req.body.locationend) || (!req.body.time) || (!req.body.range)|| (!req.body.price)) {
            console.log(req.body)
            res.json({success: false, msg: 'Enter all fields'})
        }
        else {
            var newTourbus = Tourbus({
                locationstart: req.body.locationstart,
                locationend: req.body.locationend,
                time: req.body.time,
                range: req.body.range,
                price: req.body.price
            })
            newTourbus.save(function (err, newtourbus) {
                if (err) {
                    res.json({success: false, msg: 'Failed to save'})
                }
                else {
                    res.json({success: true, msg: 'Successfully saved'})
                }
            })
        }
    },
    updatetourbus: function (req, res) {
        Tourbus.findByIdAndUpdate( {_id: req.body.id},{locationstart: req.body.locationstart, 
            locationend: req.body.locationend,time: req.body.time, range: req.body.range, price: req.body.price}, function(err, tourbus){
            if (err) return res.send(500, {error: err});
            if(!tourbus){
                res.status(403).send({success: false, msg: 'Not found'})
            }
            else
            {
                tourbus.save(function (err, tourbus) {
                    if (err) {
                        res.json({success: false, msg: 'Failed to save'})
                    }
                    else {
                        res.json({success: true, msg: 'Successfully saved'})
                    }
                        })
            }
        })
    },
    deletetourbus: function (req, res) {
        Tourbus.findByIdAndDelete( {_id: req.body.id}, function(err, tourbus){
            if(err || !tourbus){
                res.status(403).send({success: false, msg: 'Not found'})
            }
            else
            {
                return res.json({success: true, msg: 'success'})
            }
        })
    },
    gettourbus: function (req, res) {
        var id = req.query.id;
        if(id){
            Tourbus.find({_id: id}, function(err, tourbus){
                if(err || !tourbus){
                    res.status(403).send({success: false, msg: 'Not found'})
                }else{
                    return res.json(tourbus)
                }
            })
        }else{
            Tourbus.find({}, function(err, tourbus){
                if(err || !tourbus){
                    res.status(403).send({success: false, msg: 'Not found'})
                }else{
                    return res.json(tourbus)
                }
            })
        }
    },
    addchedule: function (req, res) {
        if ((!req.body.idtour) ||(!req.body.locationstart) || (!req.body.locationend) || (!req.body.schedule)) {
            console.log(req.body)
            res.json({success: false, msg: 'Enter all fields'})
        }
        else {
            var newSchedule = Schedule({
                idtour: req.body.idtour,
                locationstart: req.body.locationstart,
                locationend: req.body.locationend,
                schedule: req.body.schedule
            })
            newSchedule.save(function (err, newschedule) {
                if (err) {
                    res.json({success: false, msg: 'Failed to save'})
                }
                else {
                    res.json({success: true, msg: 'Successfully saved'})
                }
            })
        }
    },
    updatechedule: function (req, res) {
        Schedule.findByIdAndUpdate( {_id: req.body.id},
            {
                idtour: req.body.idtour,
                locationstart: req.body.locationstart, 
                locationend: req.body.locationend,
                schedule: req.body.schedule
            }, function(err, schedule){
            if (err) return res.send(500, {error: err});
            if(!schedule){
                res.status(403).send({success: false, msg: 'Not found'})
            }
            else
            {
                schedule.save(function (err, schedule) {
                    if (err) {
                        res.json({success: false, msg: 'Failed to save'})
                    }
                    else {
                        res.json({success: true, msg: 'Successfully saved'})
                    }
                        })
            }
        })
    },
    deletechedule: function (req, res) {
        Schedule.findByIdAndDelete( {_id: req.body.id}, function(err, schedule){
            if(err || !schedule){
                res.status(403).send({success: false, msg: 'Not found'})
            }
            else
            {
                return res.json({success: true, msg: 'success'})
            }
        })
    },
    getschedule: function (req, res) {
        var id = req.query.idtour;
        if(id){
            Schedule.findOne({idtour: id}, function(err, schedule){
                if(err || !schedule){
                    res.status(403).send({success: false, msg: 'Not found'})
                }else{
                    return res.json(schedule)
                }
            })
        }else{
            Schedule.find({}, function(err, schedule){
                if(err || !schedule){
                    res.status(403).send({success: false, msg: 'Not found'})
                }else{
                    return res.json(schedule)
                }
            })
        }
    },
    addpickup: function (req, res) {
        if ((!req.body.tourid) ||(!req.body.time) || (!req.body.address)) {
            console.log(req.body)
            res.json({success: false, msg: 'Enter all fields'})
        }
        else {
            var newPickupPoint = PickupPoint({
                tourid: req.body.tourid,
                address: req.body.address,
                time: req.body.time
            })
            newPickupPoint.save(function (err, newpickuppoint) {
                if (err) {
                    res.json({success: false, msg: 'Failed to save'})
                }
                else {
                    res.json({success: true, msg: 'Successfully saved'})
                }
            })
        }
    },
    getpickup: function (req, res) {
        var id = req.query.tourid;
        if(id){
            PickupPoint.find({tourid: id}, function(err, pickuppoint){
                if(err || !pickuppoint){
                    res.status(403).send({success: false, msg: 'Not found'})
                }else{
                    return res.json(pickuppoint)
                }
            })
        }else{
            PickupPoint.find({}, function(err, pickuppoint){
                if(err || !pickuppoint){
                    res.status(403).send({success: false, msg: 'Not found'})
                }else{
                    return res.json(pickuppoint)
                }
            })
        }
    },
    updatePickup: function (req, res) {
        PickupPoint.findByIdAndUpdate( {_id: req.body.id},
            {
                idtour: req.body.idtour,
                address: req.body.address, 
                time: req.body.time
            }, function(err, pickup){
            if (err) return res.send(500, {error: err});
            if(!pickup){
                res.status(403).send({success: false, msg: 'Not found'})
            }
            else
            {
                pickup.save(function (err, pickup) {
                    if (err) {
                        res.json({success: false, msg: 'Failed to save'})
                    }
                    else {
                        res.json({success: true, msg: 'Successfully saved'})
                    }
                        })
            }
        })
    },
    deletePickUp: function (req, res) {
        PickupPoint.findByIdAndDelete( {_id: req.body.id}, function(err, pickup){
            if(err || !pickup){
                res.status(403).send({success: false, msg: 'Not found'})
            }
            else
            {
                return res.json({success: true, msg: 'success'})
            }
        })
    },
    addseat: function (req, res) {
        if ((!req.body.name) ||(!req.body.status) || (!req.body.quantity)) {
            console.log(req.body)
            res.json({success: false, msg: 'Enter all fields'})
        }
        else {
            var newSeat = Seat({
                name: req.body.name,
                status: req.body.status,
                quantity: req.body.quantity
            })
            newSeat.save(function (err, newseat) {
                if (err) {
                    res.json({success: false, msg: 'Failed to save'})
                }
                else {
                    res.json({success: true, msg: 'Successfully saved'})
                }
            })
        }
    },
    getseat: function (req, res) {
        var id = req.query.id;
        if(id){
            Seat.findOne({_id: id}, function(err, seat){
                if(err || !seat){
                    res.status(403).send({success: false, msg: 'Not found'})
                }else{
                    return res.json(seat)
                }
            })
        }else{
            Seat.find({}, function(err, seat){
                if(err || !seat){
                    res.status(403).send({success: false, msg: 'Not found'})
                }else{
                    return res.json(seat)
                }
            })
        }
    },
    addorder: function (req, res) {
        if ((!req.body.id) ||(!req.body.name) || (!req.body.email)||(!req.body.tour) || (!req.body.timetour)||(!req.body.quantity) || (!req.body.seat)||(!req.body.price) || (!req.body.totalprice)) {
            console.log(req.body)
            res.json({success: false, msg: 'Enter all fields'})
        }
        else {
            var newOrder = Order({
                uid: req.body.id,
                name: req.body.name,
                email: req.body.email,
                tour: req.body.tour,
                timetour: req.body.timetour,
                quantity: req.body.quantity,
                seat: req.body.seat,
                price: req.body.price,
                totalprice: req.body.totalprice
            })
            newOrder.save(function (err, neworder) {
                if (err) {
                    res.json({success: false, msg: 'Failed to save'})
                }
                else {
                    res.json({success: true, msg: 'Successfully saved'})
                }
            })
        }
    },
    getorder: function (req, res) {
        var id = req.query.id;
        if(id){
            Order.findOne({_id: id}, function(err, seat){
                if(err || !seat){
                    res.status(403).send({success: false, msg: 'Not found'})
                }else{
                    return res.json(seat)
                }
            })
        }else{
            Order.find({}, function(err, seat){
                if(err || !seat){
                    res.status(403).send({success: false, msg: 'Not found'})
                }else{
                    return res.json(seat)
                }
            })
        }
    },
    getuser: function (req, res) {
        var id = req.query.id;
        if(id){
            User.findOne({_id: id}, function(err, user){
                if(err || !user){
                    res.status(403).send({success: false, msg: 'Not found'})
                }else{
                    return res.json(user)
                }
            })
        }else{
            User.find({}, function(err, user){
                if(err || !user){
                    res.status(403).send({success: false, msg: 'Not found'})
                }else{
                    return res.json(user)
                }
            })
        }
    },
    addCar: function (req, res) {
        if ((!req.body.driverid) || (!req.body.supportid) || (!req.body.tourid) || (!req.body.status)) {
            console.log(req.body)
            res.json({success: false, msg: 'Enter all fields'})
        }
        else {
            var newCar = Car({
                driverid: req.body.driverid,
                supportid: req.body.supportid,
                tourid: req.body.tourid,
                status: req.body.status,
            })
            newCar.save(function (err, newCar) {
                if (err) {
                    res.json({success: false, msg: 'Failed to save'})
                }
                else {
                    res.json({success: true, msg: 'Successfully saved'})
                }
            })
        }
    },
    getCar: function (req, res) {
        var id = req.query.id;
        if(id){
            Car.findOne({_id: id}, function(err, car){
                if(err || !car){
                    res.status(403).send({success: false, msg: 'Not found'})
                }else{
                    return res.json(car)
                }
            })
        }else{
            Car.find({}, function(err, car){
                if(err || !car){
                    res.status(403).send({success: false, msg: 'Not found'})
                }else{
                    return res.json(car)
                }
            })
        }
    },
    deleteCar: function (req, res) {
        Car.findByIdAndDelete( {_id: req.body.id}, function(err, car){
            if(err || !car){
                res.status(403).send({success: false, msg: 'Not found'})
            }
            else
            {
                return res.json({success: true, msg: 'success'})
            }
        })
    },
    updateCar: function (req, res) {
        Car.findByIdAndUpdate( {_id: req.body.id},
            {
                idtour: req.body.idtour,
                driverid: req.body.driverid, 
                supportid: req.body.supportid,
                status: req.body.status
            }, function(err, car){
            if (err) return res.send(500, {error: err});
            if(!car){
                res.status(403).send({success: false, msg: 'Not found'})
            }
            else
            {
                car.save(function (err, car) {
                    if (err) {
                        res.json({success: false, msg: 'Failed to save'})
                    }
                    else {
                        res.json({success: true, msg: 'Successfully saved'})
                    }
                        })
            }
        })
    },
    }

module.exports = functions