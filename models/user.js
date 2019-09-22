var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	
	username: {
		type: String,
		unique: true,
		required: true			  
			  },
	passport: String,
	isAdmin:{
	type: Boolean,
	defualt: false
},
	firstName: String,
	lastName: String,
	email: {
		type: String,
		unique: true,
		required: true			  
			  },
	avatar: String,
	resetPasswordToken: String,
	resetPasswordExpires: Date
	
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);