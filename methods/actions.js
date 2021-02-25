var User = require('../models/user')
var Address = require('../models/address')
var Tourbus = require('../models/tourbus')
var Schedule = require('../models/chedule')
var PickupPoint = require('../models/pickuppoint')
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
        if ((!req.body.email) || (!req.body.password) || (!req.body.name) || (!req.body.phone)) {
            console.log(req.body)
            res.json({success: false, msg: 'Enter all fields'})
        }
        else {
            var newUser = User({
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
                phone: req.body.phone
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
                            res.json({success: true, token: token})
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
        var ids = [req.body.uid]
        Address.find({
            'uid': { $in: ids}
        }, function(err, address){
            if(err || !address){
                res.status(403).send({success: false, msg: 'Not found'})
            }else{
                return res.json(address)
            }
        })
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
        // Tourbus.find({}, function(err, tourbus){
        //     if(err || !tourbus){
        //         res.status(403).send({success: false, msg: 'Not found'})
        //     }else{
        //         return res.json(tourbus)
        //     }
        // })
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
                schedule: 
                    {
                        time: req.body.schedule.time,
                        location: req.body.schedule.location,
                        address: req.body.schedule.address
                    }  
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
        if ((!req.body.tourid) ||(!req.body.title) || (!req.body.address)) {
            console.log(req.body)
            res.json({success: false, msg: 'Enter all fields'})
        }
        else {
            var newPickupPoint = PickupPoint({
                tourid: req.body.tourid,
                title: req.body.title,
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
            PickupPoint.findOne({tourid: id}, function(err, pickuppoint){
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
    }

module.exports = functions