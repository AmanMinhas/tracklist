var mongoose = require('mongoose');
var Tracks = require('./tracks');
var Schema = mongoose.Schema;

var genresSchema = new Schema({
	name: String
});

genresSchema.post('remove', function(oGenre) {

	//Delete The genre from tracks that have it.
	Tracks.update(
		{},
		{$pull: {genres: {_id : oGenre._id}} },
		{multi: true},
		function(err,data) {
			// console.log("Post Removed Tracks Updated", data);
		}
	);
})

//Update the data in tracks 
genresSchema.post('save', function(oGenre) {
	// console.log("In update");
	Tracks.find(
        {genres : {$elemMatch : { _id : oGenre._id}}}, 
        {"_id" : 1},
        function(err,arrObjTrackIds) {
        	console.log(arrObjTrackIds);
        	if(arrObjTrackIds.length>0) {

	            var arrTrackIds = [];
	            for(var i = 0; i<arrObjTrackIds.length; i++) {
	                arrTrackIds.push(arrObjTrackIds[i]._id);
	            }

			 	//Update The genre in tracks that have it.
				Tracks.update(
					{_id : {$in : arrTrackIds}},
					{$pull: {genres: {_id : oGenre._id}} },
					{multi: true},
					function(err,data) {
						if (err) console.log(err);
						console.log("Post Removed Tracks Updated", data);
					}
				);

				//Update The genre in tracks that have it.
				Tracks.update(
					{_id : {$in : arrTrackIds}},
					{$push : { genres : oGenre}}, 
					{multi: true},
					function( err, data ){
						if (err) console.log(err);
						console.log("Added to Track ", data);
					}
				);
        	}

        }
    );
});

var Genres = mongoose.model('genres', genresSchema);
module.exports = Genres;