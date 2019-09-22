var express = require("express");
var router  = express.Router();
var Service = require("../models/service");
var middleware = require ("../middleware");
var request = require("request");


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


// INDEX Routes - SHOW ALL SERVICES

router.get("/", function(req, res){
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        Service.find({title: regex}, function(err, allServices){
           if(err){
               console.log(err);
           } else {
              if(allServices.length < 1) {
                  noMatch = "No services match that query, please try again.";
              }
              res.render("services/index",{services:allServices, noMatch: noMatch, currentUser: req.user, page:"services"});
           }
        });
    } else {
        // Get all services from DB
        Service.find({}, function(err, allServices){
           if(err){
               console.log(err);
           } else {
			    
			   request("http://api.openweathermap.org/data/2.5/forecast?id=6167865&APPID=a0804d41faea9cf5608307384b193504&units=metric", function (error, response,body){
		
								if(!error && response.statusCode == 200){
									var data = JSON.parse(body);
									// var temprature = data.list[0].main.temp;
									// var city = data.city.name;
									// var status =  data.list[0].weather[0].main;
									
									// var currentWeather = {temprature: temprature, city: city, status: status} 
								res.render("services/index",{services:allServices, noMatch: noMatch, currentUser: req.user, page:"services", data: data});
								}
							});             
           }
        });
    }
});

// CREAT REOUTE - CREATE NEW SERVICE TO DB
router.post("/", middleware.isLoggedIn,function(req,res){
	
	// get date from form and add to services array
	var title = req.body.title;
	var image = req.body.image;
	var desc  = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newService = {title: title, image: image, description: desc , author: author}
	//services.push(newService);  ----> no more needed after db added
	// create a new service and save it to DB
	Service.create(newService, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			// redirect back to services page
	res.redirect("/services");
		}
	});
	
});


// NEW  ROUTES - SHOW FORM
router.get("/new",middleware.isLoggedIn ,function(req,res){
	res.render("services/new");
});


// SHOW ROUTE - SHOW INFO ABOUT A SERVICE
router.get("/:id", function(req,res){
	// find the service with provided ID
	Service.findById(req.params.id).populate("comments").exec( function(err, foundService){
		if(err || !foundService){
			req.flash("error", "Service not found");
			res.redirect("/services");
		}else{
			// render show template with that service
			Service.find({}, function (err, allServices){
				if(err){
					console.log(err);
				}else{
					res.render("services/show", {service: foundService, services: allServices});
				}
			});
			
		}
	});	
});


// EDIT Service route
router.get("/:id/edit", middleware.checkServiceOwnership ,function(req,res){
	
		Service.findById(req.params.id, function(err, foundService){				
				res.render("services/edit" , {service: foundService});
			});

});
// UPDATE service route
router.put("/:id", middleware.checkServiceOwnership ,function(req,res){
	// find and update the correct service
	Service.findByIdAndUpdate(req.params.id, req.body.service, function(err, updatedService){
		if (err){
			
			res.redirect("/services");
		}else{
			//redirect to somewhere
			res.redirect("/services/" + req.params.id);
		}
	});
	
});

// Destroy service route
router.delete("/:id", middleware.checkServiceOwnership,function(req,res){
	Service.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/services");
		}else{
			res.redirect("/services");
		}
	});
});




module.exports = router;
