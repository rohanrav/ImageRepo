require('dotenv').config()

// Imports
const path = require("path")
const fs = require("fs")
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const session = require('express-session')
const passport = require("passport")
const { strategy } = require("./passportStrategy")
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const Jimp = require('jimp');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
const { getTimeDiffAndPrettyText, dateAdd } = require("./timeParsing")
const { Image, User } = require("./MongoModels")
const { sortHome, sortReverseImageSearch, getTimeText } = require("./utils")

// Express Initialization
const app = express()

app.use(express.static(path.join(__dirname, "public")))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
    extended: true
}))

// MongoDB Initialization
mongoose.connect("mongodb://localhost:27017/ImageUserDB", { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set("useCreateIndex", true)

// Passport Initialization
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

// Passport Serialize and Deserialize User
passport.serializeUser(function(user, done) {
    done(null, user.id)
})

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user)
    })
})

passport.use(strategy);

/* 
    Express Routes
*/

// GET Requests
// Main Route
app.get("/", function(req, res) {
    if (req.isAuthenticated()) {
        res.redirect("/home")
    } else {
        res.redirect("/login")
    }
})

// Login Route
app.get("/login", function(req, res) {
    if (req.isAuthenticated()) {
        res.redirect("/home")
    } else {
        res.render("login")
    }
})

// Home Route
app.get("/home", function(req, res) {
    if (req.isAuthenticated()) {
        Image.find({}, function(err, docs) {
            docs.forEach(getTimeText)
            docs = docs.sort(sortHome)
            res.render("home", {
                images: docs,
                userID: req.user._id
            })
        })
    } else {
        res.redirect("/login")
    }
})

// Account Route
app.get("/account", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("account", { user: req.user })
    } else {
        res.redirect("/login")
    }
})

// Logout Route
app.get("/logout", function(req, res) {
    if (req.isAuthenticated()) {
        req.logOut()
        res.redirect("/")
    } else {
        res.redirect("/login")
    }
})

// Sell Image Route
app.get("/sell-img", function(req, res) {
    if (req.isAuthenticated()) {
        let currentSellImg = {}
        for (i = req.user.ownImages.length - 1; i >= 0; i--) {
            if (!req.user.ownImages[i].sellImg) {
                currentSellImg = req.user.ownImages[i]
            }
        }
        res.render("sell-img", {
            user: req.user,
            currentSellImg: currentSellImg
        })
    } else {
        res.redirect("/login")
    }
})

// Buy Image Route
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

                        result.forEach(getTimeText)
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

// Payment Success Route
app.get('/paymentSuccess', function(req, res) {
    if (req.isAuthenticated()) {
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
    } else {
        res.redirect("/login")
    }
})

// Payment Failure Route
app.get('/paymentFailure', function(req, res) {
    if (req.isAuthenticated()) {
        res.render("paymentFailure")
    } else {
        res.redirect("/login")
    }
})

// Search Route
app.get("/search", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("search", { searchQuery: "test" })
    } else {
        res.redirect('/login')
    }
})

// Purchase History Route
app.get("/purchaseHistory", function(req, res) {
    if (req.isAuthenticated()) {
        let purchases = req.user.purchaseHistory;
        purchases.forEach(getTimeText)
        res.render("purchaseHistory", { purchaseHistoryArr: purchases })
    } else {
        res.redirect("/login")
    }
})

// Reverse Image Search Route
app.get("/reverseImageSearch", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("reverseImageSearch", {
            uploadPhoto: undefined,
            searchResults: undefined
        })
    } else {
        res.redirect("/login")
    }
})

// POST Requests
// Account Route
app.post("/account", upload.single('avatar'), function(req, res, next) {
    if (req.isAuthenticated()) {
        const bodyObjects = req.body.objects.split("|")
        const obs = Array.from(new Set(bodyObjects.slice(1, bodyObjects.length)))

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

// Reverse Image Search Route
app.post("/reverseImageSearch", upload.single('avatar'), function(req, res, next) {
    if (req.isAuthenticated()) {
        Image.find({
            $or: [
                { sellImg: true },
                { ownerUserID: req.user._id }
            ]
        }, function(err, docs) {
            Jimp.read(__dirname + '/uploads/' + req.file.filename).then(async(uploadedImg) => {
                for (i = 0; i < docs.length; i++) {
                    const read = await Jimp.read(docs[i].img.data).then(async(iterImg) => {
                        let distance = await Jimp.distance(uploadedImg, iterImg)
                        let diff = await Jimp.diff(uploadedImg, iterImg).percent
                        if (distance < 0.75 || diff < 0.75) {
                            docs[i].difference = distance + diff
                        } else {
                            docs[i].difference = 100000000000000
                        }
                    })
                }
                docs = docs.sort(sortReverseImageSearch).slice(0, 3)
                const uploadedImageToSend = Image({
                    img: {
                        data: fs.readFileSync(__dirname + '/uploads/' + req.file.filename),
                        contentType: req.file.mimetype
                    }
                })
                docs.forEach(getTimeText)
                res.render("reverseImageSearch", {
                    uploadPhoto: uploadedImageToSend,
                    searchResults: docs,
                    userID: req.user._id
                })
                fs.unlinkSync(__dirname + '/uploads/' + req.file.filename)
            })
        })
    } else {
        res.redirect("/login")
    }
})

// Login Route
app.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect("/home")
});

// Delete Route
app.post("/delete", function(req, res) {
    Image.deleteMany({ _id: { $in: req.body.checkbox } }, function(err) {
        if (!err) {
            User.update({ _id: req.user._id }, {
                $pull: { ownImages: { _id: { $in: req.body.checkbox } } }
            }, function(err) {
                if (!err) {
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

// Sell Image Route
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

// Add Sell Image Route
app.post("/addSellImg", function(req, res) {
    if (req.isAuthenticated()) {
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
    } else {
        res.redirect("/login")
    }
})

// Buy Image Route
app.post("/buy-img/:imgID", function(req, res) {
    if (req.isAuthenticated()) {
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
                    result.forEach(getTimeText)
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
                        $push: {
                            ownImages: docs,
                            purchaseHistory: {
                                purchaseType: "Buy",
                                price: buyImgPrice,
                                caption: docs.caption,
                                date: new Date(),
                                img: docs.img
                            }
                        }
                    }, function(err) {
                        if (!err) {
                            User.findByIdAndUpdate(ImgOwnerID, {
                                $inc: { credits: buyImgPrice },
                                $pull: { ownImages: { _id: buyImgID } },
                                $push: {
                                    purchaseHistory: {
                                        purchaseType: "Sell",
                                        price: buyImgPrice,
                                        caption: docs.caption,
                                        date: new Date(),
                                        img: docs.img
                                    }
                                }
                            }, function(err) {
                                if (!err) {
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
    } else {
        res.redirect("/login")
    }
})

// Add Credits Route (Stripe)
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
        success_url: 'http://' + req.get('Host') + '/paymentSuccess',
        cancel_url: 'http://' + req.get('Host') + '/account',
    })

    res.json({ id: session.id })
})

// Search Route
app.post("/search", function(req, res) {
    if (req.isAuthenticated()) {
        Image.find({
            $or: [
                { caption: { $regex: `.*${req.body.searchInput}.*`, $options: "i" } },
                { characteristics: { $regex: `.*${req.body.searchInput.toLowerCase()}.*` } }
            ]
        }, function(err, searchResults) {
            searchResults.forEach(getTimeText)
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
    } else {
        res.redirect('/login')
    }
})

// SERVER
app.listen(3000, function() {
    console.log("Server started on port 3000.")
})