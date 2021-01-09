const LocalStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const { Image, User } = require("./MongoModels")

mongoose.connect("mongodb://localhost:27017/ImageUserDB", { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set("useCreateIndex", true)

let strategy = new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    },
    function(email, password, done) {
        User.findOne({ email: email }, function(err, user) {
            if (err) { return done(err); }
            // Create New User
            if (!user) {
                bcrypt.hash(password, 10, function(err, hash) {
                    const newUser = new User({
                        email: email,
                        password: hash,
                        credits: 0,
                        images: []
                    })

                    newUser.save().then(function(savedUser) {
                        console.log('Saved user successfully: %j', savedUser);
                        return done(null, savedUser);
                    })
                })
            } else { // Return Existing User
                bcrypt.compare(password, user.password, function(err, result) {
                    if (result) {
                        return done(null, user);
                    } else {
                        done(null, false, { message: 'Incorrect password.' });
                    }
                });
            }
        });
    }
)

exports.strategy = strategy