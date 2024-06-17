require('dotenv').config();
require('./Auth');
const path = require('path');
const express = require('express');
const { static, Router } = require("express");
const api = Router();
const fs = require("fs");
const { join } = require("path");
const config = require("../config");
const session = require("express-session");
const passport = require('passport');
const cors = require('cors');
const MongoStore = require('connect-mongo');

const RoutesPath = join(__dirname, "Routes");

fs.readdir(RoutesPath, (err, files) => {
    if (err) return console.log(err);
    files.forEach((file) => {
        api.use("/api/" + file.split(".")[0], require(RoutesPath + "/" + file));
    });
});

const publicPath = path.join(__dirname, '../assets');
api.use(static(publicPath));
api.use(express.json());

// Handle Login and other stuff

// mongoose.connect(process.env.MONGOOSE_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

api.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

api.use(cors({
    origin: ['https://localhost'],
    credentials: true,
}));

api.use(session({
    secret: 'secret',
    cookie: {
        maxAge: 60000 * 60 * 1
    },
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGOOSE_URL
    }),
}));

api.use(passport.initialize());
api.use(passport.session());

api.get(config.CallbackURL,
    passport.authenticate("discord", { failureRedirect: "/", }),
    function (req, res) {
        // console.log(req.session);
        const redirectTo = req.session.returnTo || '/dashboard';
        delete req.session.returnTo; // Clear the returnTo value
        res.redirect(redirectTo);
    }
);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

api.use("/", require("./routes"));

module.exports = api;