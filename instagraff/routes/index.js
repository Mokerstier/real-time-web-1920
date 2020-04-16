function routes(){
    const {
		onLoginGet,
		onLoginPost,
		onRegister,
		onLogout
	} = require("../controllers/render/login");
	const {
		onUpload
	} = require("../controllers/upload")

    const exRoutes = require("express").Router();
	const bodyParser = require("body-parser");
	const urlencodedParser = bodyParser.urlencoded({ extended: true });
	// const isLoggedIn = require("../controllers/loggedin");
	// const changePassword = require("../controllers/change-password");
        
        // GET routes
    exRoutes
        
        .get("/login", onLoginGet)
        .get("/register", onRegister)
        .get("/", (req, res) => {
			res.render("pages/home.ejs", {
				title: "Instagraff"
			});
		})
        // POST routes
        .post("/login", onLoginPost)
		.post("/register", onLoginPost)
		.post("/upload", onUpload)

        return exRoutes
}

exports.routes = routes();