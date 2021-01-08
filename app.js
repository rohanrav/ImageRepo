require('dotenv').config()
const bcrypt = require("bcrypt")
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const session = require('express-session')
const passport = require("passport")
const { Image, User } = require("./MongoModels")
const LocalStrategy = require("passport-local").Strategy
const fs = require("fs")
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const { getTimeDiffAndPrettyText, dateAdd } = require("./timeParsing")
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

const app = express()

app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect("mongodb://localhost:27017/ImageUserDB", { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set("useCreateIndex", true)

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.id)
})

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user)
    })
})

passport.use(new LocalStrategy({
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
));

// GET REQUESTS

app.get("/", function(req, res) {
    if (req.isAuthenticated()) {
        Image.find({}, function(err, docs) {
            res.redirect("/home")
        })
    } else {
        console.log("Redirected by '/' route to Login Route")
        res.redirect("/login")
    }
})

app.get("/login", function(req, res) {
    if (req.isAuthenticated()) {
        res.redirect("/home")
    } else {
        res.render("login")
    }
})

app.get("/home", function(req, res) {
    if (req.isAuthenticated()) {
        Image.find({}, function(err, docs) {
            //console.log(mongoose.Types.ObjectId())

            docs.forEach(function(image) {
                image.timeText = getTimeDiffAndPrettyText(image.date).friendlyNiceText
            })

            docs = docs.sort(function(a, b) {
                if ((new Date() - a.date) > (new Date() - b.date)) {
                    return 1
                } else if ((new Date() - a.date) < (new Date() - b.date)) {
                    return -1
                } else {
                    return 0
                }
            })

            console.log(docs)

            res.render("home", {
                images: docs,
                userID: req.user._id
            })
        })
    } else {
        console.log("Redirected by '/home' route to Login Route")
        res.redirect("/login")
    }
})

app.get("/account", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("account", { user: req.user })
    } else {
        res.redirect("/login")
    }
})

app.get("/logout", function(req, res) {
    if (req.isAuthenticated()) {
        req.logOut()
        res.redirect("/")
    } else {
        res.redirect("/login")
    }
})

app.get("/sell-img", function(req, res) {
    if (req.isAuthenticated()) {
        let currentSellImgV = {}
        for (i = req.user.ownImages.length - 1; i >= 0; i--) {
            if (!req.user.ownImages[i].sellImg) {
                currentSellImgV = req.user.ownImages[i]
            }
        }
        res.render("sell-img", {
            user: req.user,
            currentSellImg: currentSellImgV //make sure this image has sellImg property set to false
        })
    } else {
        res.redirect("/login")
    }
})

app.get("/buy-img/:imgID", function(req, res) {
    if (req.isAuthenticated()) {
        Image.findById(req.params.imgID, function(err, docs) {
            if (!err) {
                Image.aggregate([{
                    $sample: { size: 4 }
                }, {
                    $match: {
                        $and: [
                            { ownerUserID: { $ne: req.user._id } },
                            { _id: { $ne: docs._id } },
                            { sellImg: true }
                        ]
                    }
                }], function(err, result) {
                    if (!err) {

                        result.forEach(function(image) {
                            image.timeText = getTimeDiffAndPrettyText(image.date).friendlyNiceText
                        })
                        docs.timeText = getTimeDiffAndPrettyText(docs.date).friendlyNiceText

                        res.render("buy-img", { buyImg: docs, moreImgs: result })
                    } else {
                        console.log(err)
                    }
                })
            } else {
                console.log(err)
            }
        })
    } else {
        res.redirect("/login")
    }
})

app.get('/paymentSuccess', function(req, res) {
    User.findOneAndUpdate({ _id: req.user._id }, {
            $inc: { credits: 100 }
        }, { new: true },
        function(err, docs) {
            if (!err) {
                res.render("paymentSuccess")
            } else {
                console.log(err)
            }
        })
})

app.get('/paymentFailure', function(req, res) {
    res.render("paymentFailure")
})

app.get("/search", function(req, res) {
    res.render("search", { searchQuery: "test" })
})

// POST REQUESTS

app.post("/account", upload.single('avatar'), function(req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any

    // ADD IMAGE PROPERTIES TO IMAGES SCHEMA
    // do ML stuff to grab image properties 
    // get image properties in a list, add it to the images data

    const obs = Array.from(new Set(req.body.objects.split("|").slice(1, req.body.objects.split("|").length)))

    if (req.isAuthenticated()) {
        const newImg = new Image({
            ownerUserID: req.user._id,
            caption: req.body.caption,
            img: {
                data: fs.readFileSync(__dirname + '/uploads/' + req.file.filename),
                contentType: req.file.mimetype
            },
            price: 0,
            characteristics: obs,
        })

        User.findOneAndUpdate({ _id: req.user._id }, { $push: { ownImages: newImg } },
            function(err, foundList) {
                if (err) {
                    console.log(err)
                } else {
                    newImg.save().then(function(savedImg) {
                        fs.unlinkSync(__dirname + '/uploads/' + req.file.filename)
                    })
                    res.redirect("/account")
                }
            })
    } else {
        res.redirect("/login")
    }
})

app.post('/login', passport.authenticate('local'), function(req, res) {
    //console.log('Logging in as: ' + req.user);
    res.redirect("/home")
});

app.post("/delete", function(req, res) {
    Image.deleteMany({ _id: { $in: req.body.checkbox } }, function(err) {
        if (!err) {
            console.log("Delete Images from Image Collection")
            User.update({ _id: req.user._id }, {
                $pull: { ownImages: { _id: { $in: req.body.checkbox } } }
            }, function(err) {
                if (!err) {
                    console.log("Delete Images from User Collection")
                    res.redirect("/account")
                } else {
                    console.log(err)
                }
            })
        } else {
            console.log(err)
        }
    })
})

app.post("/sell-img", function(req, res) {
    if (req.isAuthenticated()) {
        Image.findById(req.body.checkbox, function(err, docs) {
            if (!err) {
                res.render("sell-img", {
                    user: req.user,
                    currentSellImg: docs
                })
            } else {
                res.redirect("/sell-img")
            }
        })
    } else {
        res.redirect("/login")
    }
})

app.post("/addSellImg", function(req, res) {
    Image.findByIdAndUpdate(req.body._id, {
        sellImg: true,
        price: req.body.creditPrice,
        date: new Date()
    }, function(err, docs) {
        if (!err) {
            User.findOneAndUpdate({ _id: req.user._id, "ownImages._id": req.body._id }, {
                    $set: {
                        "ownImages.$.sellImg": true,
                        "ownImages.$.price": req.body.creditPrice,
                        "ownImages.$.date": new Date()
                    }
                }, { new: true },
                function(err, docs) {
                    res.redirect("/sell-img")
                })

        } else {
            console.log(err)
        }
    })
})

app.post("/buy-img/:imgID", function(req, res) {
    const buyImgID = req.params.imgID
    const buyImgPrice = req.body.imageInfo.split(" ")[0]
    const ImgOwnerID = req.body.imageInfo.split(" ")[1]

    if (buyImgPrice > req.user.credits) {
        Image.aggregate([{
            $sample: { size: 4 }
        }, {
            $match: {
                $and: [
                    { _id: { $ne: buyImgID } },
                    { sellImg: true }
                ]
            }
        }], function(err, result) {
            if (!err) {
                result.forEach(function(image) {
                    image.timeText = getTimeDiffAndPrettyText(image.date).friendlyNiceText
                })
                res.render("failure", { buyImg: buyImgID, moreImgs: result })
            } else {
                console.log(err)
            }
        })
    } else {
        Image.findByIdAndUpdate(buyImgID, {
            $set: {
                ownerUserID: req.user._id,
                sellImg: false,
                price: 0
            }
        }, { new: true }, function(err, docs) {
            if (!err) {
                User.findByIdAndUpdate(req.user._id, {
                    $inc: { credits: -buyImgPrice },
                    $push: { ownImages: docs }
                }, function(err) {
                    if (!err) {
                        User.findByIdAndUpdate(ImgOwnerID, {
                            $inc: { credits: buyImgPrice },
                            $pull: { ownImages: { _id: buyImgID } }
                        }, function(err) {
                            if (!err) {
                                // show success page 
                                docs.timeText = getTimeDiffAndPrettyText(docs.date).friendlyNiceText
                                docs.price = buyImgPrice
                                res.render("success", { buyImg: docs })
                            }
                        })
                    } else {
                        console.log(err)
                    }
                })
            } else {
                console.log(err)
            }
        })
    }
})

app.post('/create-checkout-session', async function(req, res) {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'cad',
                product_data: {
                    name: 'Credits',
                    description: 'This $10.00 charge will add 100 credits to your ImageRepo Account!'
                },
                unit_amount: 1000,
            },
            quantity: 1,
        }, ],
        mode: 'payment',
        success_url: 'http://localhost:3000/paymentSuccess',
        cancel_url: 'http://localhost:3000/account',
    })

    res.json({ id: session.id })
})

app.post("/search", function(req, res) {
    console.log(req.body.searchInput)
    Image.find({
        $or: [
            { caption: { $regex: `.*${req.body.searchInput}.*`, $options: "i" } },
            { characteristics: { $regex: `.*${req.body.searchInput.toLowerCase()}.*` } }
        ]
    }, function(err, searchResults) {

        console.log(searchResults)
        searchResults.forEach(function(image) {
            image.timeText = getTimeDiffAndPrettyText(image.date).friendlyNiceText
        })

        if (!err) {
            res.render("search", {
                searchQuery: req.body.searchInput,
                searchResults: searchResults,
                userID: req.user._id
            })
        } else {
            console.log(err)
        }
    })

})

// SERVER

app.listen(3000, function() {
    console.log("Server started on port 3000.")
})