const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongo = require("mongodb");
const express = require("express");
const session = require("express-session");
const { userSchema } = require("../models/user");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("dotenv").config();


module.exports = function(passport) {
	passport.use(
		new LocalStrategy(
			{
				usernameField: "username",
				passwordField: "password",
				session: true
			},

			function(username, password, done) {
				let auth = { email: username };
				userSchema.findOne(auth, (err, user) => {
					if (err) throw err;
					if (!user) {
						console.log("no user found");
						return done(null, false, { message: "No user found" });
					}

					bcrypt.compare(password, user.password, (err, authSucces) => {
						if (err) throw err;
						if (authSucces) {
							console.log(`${user.nickName} is now logged in`);
							var user_id = user.id;
							return done(null, user.id);
						}
						return done(null, false, { message: "Wrong password" });
					});
				});
			}
		)
	);
	passport.serializeUser((user_id, done) => {
		done(null, user_id);
	});

	passport.deserializeUser((user_id, done) => {
		done(null, user_id);
	});
};