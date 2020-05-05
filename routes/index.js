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
	const renderData = require('../controllers/render/renderdata')
	const graffitis = require('../controllers/graffitis')
	const follow = require('../controllers/follow')
    const exRoutes = require("express").Router();
	const bodyParser = require("body-parser");
	const urlencodedParser = bodyParser.urlencoded({ extended: true });
	
	// const changePassword = require("../controllers/change-password");
        
        // GET routes
    exRoutes
        
        .get("/login", onLoginGet)
        .get("/register", onRegister)
        .get("/", graffitis.getGraffs, (req, res) => {
			console.log(req.user)
			res.render("pages/home.ejs", {
				title: "Instagraff",
				message: '',
				graffitis: res.locals.results,
				user: req.user,
			});
		})
		.get('/livedata', graffitis.getGraffs, renderData.onRenderData ,(req, res) => {
			res.send({results})
		})
		.get('/follow/:artist', isLoggedIn, follow.artist)

        // POST routes
        .post("/login", onLoginPost)
		.post("/register", onLoginPost)
		.put("/upload", isLoggedIn, onUpload,(req, res)=>{
			res.send(req)
		})

        return exRoutes
}

exports.routes = routes();