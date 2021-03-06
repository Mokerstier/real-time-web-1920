const passport = require("passport");

function onLoginGet(req, res) {
	const user = (req.user)
	res.render("pages/login.ejs", {
		title: "Login",
		user: user
	});
}
function onLoginPost(req, res, next) {
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/login",
		failureFlash: true
	})(req, res, next);
}

function onRegister(req, res) {
	const user = (req.user)
	res.render("pages/register.ejs", {
		title: "Register",
		user: user
	});
}

function onLogout(req, res, next) {
	if (req.session) {
		// check if a session is active
		// delete session object
		req.session.destroy(err => {
			if (err) {
				return next(err);
			}
			return res.redirect("/");
		});
	}
}

module.exports = { onLoginGet, onLoginPost, onRegister, onLogout };