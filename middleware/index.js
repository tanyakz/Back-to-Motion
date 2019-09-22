var Service = require("../models/service");
var Comment = require("../models/comment");
// all the middleware goes here
var middlewareObj = {
	
	
};

middlewareObj.checkServiceOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		// does user own the service?
		Service.findById(req.params.id, function(err, foundService){
		if (err || !foundService){
			req.flash("error", "Service not found");
			res.redirect("back");
		}else{
			// does user own the service?
			if(foundService.author.id.equals(req.user._id) || req.user.isAdmin){
				next();
			}else{
				req.flash("error", "You don't have permission to do that");
				res.redirect("back");
			}
			
		}
	});
	}else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
	
}

middlewareObj.checkCommentOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		// does user own the service?
		Comment.findById(req.params.comment_id, function(err, foundComment){
		if (err || !foundComment){
			req.flash("error", "comment not found");
			res.redirect("back");
		}else{
			// does user own the comment?
			if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
				next();
			}else{
				req.flash("error","You don't have permission to do that!");
				res.redirect("back");
			}
			
		}
	});
	}else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
	
}

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
		req.flash("error","You need to be logged in to do that!");
		res.redirect("/login");
		
}





module.exports = middlewareObj;