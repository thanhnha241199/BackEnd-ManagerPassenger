var User = require('../models/user')
var jwt = require('jwt-simple')
var config = require('../config/dbconfig')
var mailgun = require("mailgun-js")
var DOMAIN = 'sandboxb25e2fc7cf984723b32c0fec7547984e.mailgun.org'
var mg = mailgun({apiKey: '3fc8dfdd8323144c34284eb76b5d5ba1-d32d817f-2f5bf026', domain: DOMAIN})

var functions = {
    addNew: function (req, res) {
        if ((!req.body.email) || (!req.body.password) || (!req.body.name) || (!req.body.phone)) {
            console.log(req.body)
            res.json({success: false, msg: 'Enter all fields'})
        }
        else {
            var OTP = Math.floor(1000 + Math.random() * 9000)
            const data = {
                from: 'noreply@hello.com',
                to: 'huynhthanhnha24111999@gmail.com',
                subject: 'Hello',
                text: `OTP: ${OTP}`
            };
            mg.messages().send(data, function (error, body) {
                res.json({success: true, msg: 'Successfully saved', otp: OTP})
            });
            // var newUser = User({
            //     email: req.body.email,
            //     password: req.body.password,
            //     name: req.body.name,
            //     phone: req.body.phone
            // })
            // newUser.save(function (err, newUser) {
            //     if (err) {
            //         res.json({success: false, msg: 'Failed to save'})
            //     }
            //     else {
            //         res.json({success: true, msg: 'Successfully saved'})
            //     }
            // })
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
                            var token = jwt.encode(user, config.secret)
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
            return res.json({success: true, msg: 'Hello ' + decodedtoken.name})
        }
        else {
            return res.json({success: false, msg: 'No Headers'})
        }
    },
    // forgetpassword: function (req, res) {
    //     const {email} = req.body

    //     User.findOne({email}, (err, user){
    //         if(err || !user){
    //             return res.status(400).json({error: "User doesn't existed!"})
    //         }
    //     })
    // }
}

module.exports = functions