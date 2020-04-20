function routes(){
    const {
		onLoginGet,
		onLoginPost,
		onRegister,
		onLogout
	} = require("../controllers/render/login");
	const isLoggedIn = require('../controllers/isloggedin')
	const {
		onUpload
	} = require("../controllers/upload")
	const graffitis = require('../controllers/graffitis')
    const exRoutes = require("express").Router();
	const bodyParser = require("body-parser");
	const urlencodedParser = bodyParser.urlencoded({ extended: true });
	
	// const changePassword = require("../controllers/change-password");
        
        // GET routes
    exRoutes
        
        .get("/login", onLoginGet)
        .get("/register", onRegister)
        .get("/", graffitis.getGraffs, (req, res) => {
			res.render("pages/home.ejs", {
				title: "Instagraff",
				message: '',
				graffitis: res.locals.results
			});
		})
        // POST routes
        .post("/login", onLoginPost)
		.post("/register", onLoginPost)
		.post("/upload",isLoggedIn, onUpload)

        return exRoutes
}

exports.routes = routes();