var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var Tracks = require('../../models/tracks');
var Genres = require('../../models/genres');

router.get('/tracks',function(req,res,next) {

    var numTracksPerPage = 5;
    var numPage = req.query.page ? req.query.page : 1 ;
    numPage = parseInt(numPage);

    var strSearch = req.query.title ? req.query.title : '';

    Tracks.count({'title': {'$regex' : strSearch,'$options': 'i' }}, function(err,numCount) {
        var numCount = numCount;
        var numSkip = parseInt((numTracksPerPage * numPage) - numTracksPerPage);
        var numLastPage = parseInt(Math.ceil(numCount/numTracksPerPage));
        var strPrevPageUrl = null;
        var strNextPageUrl = null;

        if(numCount > numSkip) {

            //Search by title (case insensitive). Title can be empty.
            Tracks.find({'title': {'$regex' : strSearch,'$options': 'i' }})
                .sort({title:1})
                .skip(numSkip)
                .limit(numTracksPerPage)
                .exec(function(err,arrTracks) {
                    
                    switch(numPage) {
                        case 1 :
                            strPrevPageUrl = null;
                            if(numLastPage !== 1) strNextPageUrl = '/v1/tracks?page='+(numPage+1)+'&title='+strSearch;
                            break;
                        case numLastPage :
                            strNextPageUrl = null;
                            strPrevPageUrl = '/v1/tracks?page='+(numPage-1)+'&title='+strSearch;
                            break;
                        default : 
                            strPrevPageUrl = '/v1/tracks?page='+(numPage-1)+'&title='+strSearch;
                            strNextPageUrl = '/v1/tracks?page='+(numPage+1)+'&title='+strSearch;
                    }

                    var oRet = {
                        count : numCount,
                        next : strNextPageUrl,
                        previous : strPrevPageUrl,
                        results : arrTracks
                    };

                    res.json(oRet);

            })
        } else {
            strPrevPageUrl = '/v1/tracks?page='+numLastPage+'&title='+strSearch;
            strNextPageUrl = '/v1/tracks?page=1&title='+strSearch;

            var oRet = {
                count : numCount,
                next : strNextPageUrl,
                previous : strPrevPageUrl,
                results : []
            };
            res.json(oRet);
        }

    })
});

// Get Single track
router.get('/tracks/:id', function(req, res, next){
    Tracks.findOne({_id: req.params.id}, function(err, oTrack){
        var numCount = 0;
        if(err){
            res.send(err);
        }
        if(oTrack._id) {
            numCount = 1;
        }
        var oRet = {
            count : numCount,
            next : null,
            previous : null,
            results : [oTrack]
        };
        res.json(oRet);
    });
});

// Add/Create track
router.post('/tracks', function(req, res, next){
    
    var oTrack = req.body;
    if(!oTrack.title || !oTrack.genres || !oTrack.ratings){
        res.status(400);
        res.json({
            "error": "Bad Data",
            "oTrack" : oTrack
        });
    } else {
        // res.json(oTrack);
        Tracks.create(oTrack, function(err, oTrack){
            if(err){
                res.send(err);
            }
            res.json(oTrack);
        });
    }
    
});

// Edit Track
router.post('/track/:id', function(req, res, next){
    var oTrack = req.body;
    var strTrackId = req.params.id;
    var oUpdTrack = {};
        
    if(oTrack.title){
        oUpdTrack.title = oTrack.title;
    }

    if(oTrack.genres){
        oUpdTrack.genres = oTrack.genres;
    }


    if(oTrack.ratings){
        oUpdTrack.ratings = oTrack.ratings;
    }
    
    if(!oUpdTrack || !strTrackId){
        res.status(400);
        res.json({
            "error":"Bad Data"
        });
    } else {
        Tracks.findOne({_id: strTrackId}, function(err, oUpdTrack){
            oUpdTrack.title = oTrack.title;
            oUpdTrack.genres = oTrack.genres;
            oUpdTrack.ratings = oTrack.ratings;

            oUpdTrack.save(function(err, oTrack) {
                if(err) {
                    console.log("Err ",err);
                }
                res.json(oTrack);
            });
        });
    }
});

// Delete Track
router.delete('/track/:id', function(req, res, next){
    Tracks.remove({_id: req.params.id}, function(err, data){
        if(err){
            res.send(err);
        }
        res.json(data);
    });
});

// Get all genres
router.get('/genres',function(req,res,next) {
    var numGenresPerPage = 5;
    var numPage = req.query.page ? req.query.page : 0;
    numPage = parseInt(numPage);

    Genres.count(function(err, numCount) {
        var numCount = numCount;
        if(numPage) {
            var numSkip = parseInt((numGenresPerPage * numPage) - numGenresPerPage);
            var numLastPage = parseInt(Math.ceil(numCount/numGenresPerPage));
            var strPrevPageUrl = null;
            var strNextPageUrl = null;

            if(numCount>numSkip) {
                Genres.find()
                    .sort({name:1})
                    .skip(numSkip)
                    .limit(numGenresPerPage)
                    .exec(function(err,arrGenres) {
                        switch(numPage) {
                            case 1 :
                                strPrevPageUrl = null;
                                if(numLastPage !== 1) strNextPageUrl = '/v1/genres?page='+(numPage+1);
                                break;
                            case numLastPage :
                                strNextPageUrl = null;
                                strPrevPageUrl = '/v1/genres?page='+(numPage-1);
                                break;
                            default : 
                                strPrevPageUrl = '/v1/genres?page='+(numPage-1);
                                strNextPageUrl = '/v1/genres?page='+(numPage+1);
                        }

                        var oRet = {
                            count : numCount,
                            next : strNextPageUrl,
                            previous : strPrevPageUrl,
                            results : arrGenres
                        };

                        res.json(oRet);
                    })
            }
        } else {
            //Not Paged. Return all Genres.
            Genres.find(function(err,arrGenres){
                if(err) {
                    res.send(err);
                }
                var oRet = {
                    count : arrGenres.length,
                    next : null,
                    previous : null,
                    results : arrGenres
                };

                res.json(oRet);
            })
        }
    })

});

// Get Single track
router.get('/genres/:id', function(req, res, next){
    Genres.findOne({_id: req.params.id}, function(err, oGenre){
        var numCount = 0;
        if(err){
            res.send(err);
        }
        if(oGenre._id) {
            numCount = 1;
        }
        var oRet = {
            count : numCount,
            next : null,
            previous : null,
            results : [oGenre]
        };
        res.json(oRet);
    });
});


// Add/Create genre
router.post('/genres', function(req, res, next){
    var oGenre = req.body;
    // console.log("SAVING ",oGenre);

    if(!oGenre.name){
        res.status(400);
        res.json({
            "error": "Bad Data",
            "oGenre" : oGenre
        });
    } else {
        Genres.create(oGenre, function(err, oGenre){
            if(err){
                res.send(err);
            }
            res.json(oGenre);
        });
    }
});

// Update Genre
router.post('/genres/:id', function(req, res, next){
    var oGenre = req.body;
    var updGenre = {};
    
    if(!oGenre.name || !oGenre._id ) {
        res.status(400);
        res.json({
            "error":"Bad Data"
        });
    } else {
        //Do Find and update to run Mongoose hooks. Mongoose hooks won't fire on Model.
        var strGenreId = oGenre._id;
        var strName = oGenre.name;
        Genres.findOne({_id: strGenreId}, function(err, genre){
            genre.name = strName;
            genre.save(function(err, oGenre) {
                if(err) {
                    console.log("Err ",err);
                }
                // console.log("Data ",oGenre);
                
                res.json(oGenre);
            });
        });
    }
});

// Delete Genre
router.delete('/genre/:id', function(req, res, next){
    var strGenreId = req.params.id;

    Genres.findOne({_id: strGenreId}, function(err, oGenre){

        oGenre.remove(function(err, data){
            if(err){
                res.send(err);
            }
            // console.log("Delete return ",data);
            res.json(data);
        });
    });
});

//Playground.
router.get('/test', function(req, res, next){

    Tracks.find(
        {genres : {$elemMatch : { _id : "5882e055734d1d75e11a34ff"}}}, 
        {"_id" : 1},
        function(err,arrObjTrackIds) {
            // console.log("Found", data);
            // res.json(arrObjTrackIds);
            var arrTrackIds = [];
            for(var i = 0; i<arrObjTrackIds.length; i++) {
                arrTrackIds.push(arrObjTrackIds[i]._id);
            }
            res.json(arrTrackIds);

        }
    );
});

module.exports = router;