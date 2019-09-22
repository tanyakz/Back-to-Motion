var mongoose = require("mongoose");

// schema setup
var serviceSchema = new mongoose.Schema({
	title: String,
	image: String,
	description: String,
	author:{
	id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	username: String	
	},
	comments: [
		{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
		}
	]
});

//var Service = mongoose.model("Service", serviceSchema);

module.exports = mongoose.model("Service", serviceSchema); 