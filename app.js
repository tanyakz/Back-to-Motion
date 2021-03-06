var express               = require ("express"),
	app                   = express(),
	bodyParser            = require("body-parser"),
 	mongoose              = require ("mongoose"),
	passport              = require("passport"),
	localStrategy         = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	methodOverride        = require("method-override"),
    Service               = require ("./models/service"),
    Comment               = require("./models/comment"),
	User                  = require("./models/user"),
	request				  = require("request"),
	flash 				  = require("connect-flash"),
	seedDB      		  = require("./seeds");

	
// requiring routes
var commentRoutes         = require("./routes/comments"),
	indexRoutes            = require("./routes/index"),
	serviceRoutes         = require("./routes/services");

require('dotenv').config();

app.locals.moment = require ("moment");


mongoose.connect(process.env.DB_URL,{
 useNewUrlParser: true,
	useCreatedIndex: true,
	 useUnifiedTopology: true
}).then(() => {
	console.log('DB Connected...');
}).catch(err => {
	console.log("ERROR:", err.message);
}) ;

mongoose.set('useCreateIndex', true);

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

 seedDB(); //seed the database

// PASSPORT CONFIG	
app.use(require("express-session")({
	secret: process.env.SECRET_CODE,
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/",indexRoutes);
app.use("/services/:id/comments",commentRoutes);
app.use("/services",serviceRoutes);



app.listen(process.env.PORT || 3000, process.env.IP, function(){

  console.log("Back to Motion server is listening...");

});