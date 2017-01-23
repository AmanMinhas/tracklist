var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tracksSchema = new Schema({
	title: {
		type: String,
		index : true
	},
	ratings: String,
	genres: [{
		_id: Schema.ObjectId,
		name: String
	}]
});

var Tracks = mongoose.model('tracks', tracksSchema);
module.exports = Tracks;