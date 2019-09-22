var express = require("express");
var router  = express.Router({mergeParams: true});
var Service = require("../models/service");
var Comment = require("../models/comment");
var middleware = require ("../middleware");

// comment - NEW Routes
router.get("/new",middleware.isLoggedIn ,function(req,res){
	// find service by id
	Service.findById(req.params.id, function(err, service){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {service: service});
		}
	});	
});

// comment -Create route
router.post("/",middleware.isLoggedIn ,function(req,res){
	// lookup service using ID
	Service.findById(req.params.id, function(err, service){
		if(err){
			console.log(err);
			res.redirect("/service");
		}else{
			// create new comment
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something went wrong");
					console.log(err);
				}else{
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					// connect new comment to service
					service.comments.push(comment);
					service.save();
					// redirect service show page
					req.flash("success", "Successfully added comment");
					res.redirect('/services/' + service._id);
				}
			});
		}
	});
		
});


// EDIT COMMENT 
router.get("/:comment_id/edit", middleware.checkCommentOwnership ,function(req,res){
	Service.findById(req.params.id, function(err, foundService){
		if(err || !foundService){
			req.flash("error","Service not foound!");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit", {service_id: req.params.id, comment: foundComment});
		}
	});
	
	});
	
});


// update comment
router.put("/:comment_id",middleware.checkCommentOwnership ,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/services/"+ req.params.id);
		}
	});
});


// destroy comment routr
router.delete("/:comment_id", middleware.checkCommentOwnership ,function(req,res){
	// find by id and remove
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success","Comment deleted");
			res.redirect("/services/" + req.params.id);
		}
	});
});

module.exports = router;