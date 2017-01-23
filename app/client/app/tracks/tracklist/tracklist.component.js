"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var tracks_service_1 = require('../tracks.service');
var genres_service_1 = require('./../../genres/genres.service');
var io = require('socket.io-client');
var TrackListComponent = (function () {
    function TrackListComponent(tracksService, genresService) {
        var _this = this;
        this.tracksService = tracksService;
        this.genresService = genresService;
        this.socket = io.connect();
        this.socket.on('newTrack', function (oData) {
            console.log("New Track ", oData);
            _this.oTracksData.results.push(oData.oTrack);
            console.log(_this.oTracksData.results);
        });
        this.socket.on('sDeleteTrack', function (oData) {
            //Find the track by id and remove it from oTracksData.results
            for (var i = 0; i < _this.oTracksData.results.length; i++) {
                if (_this.oTracksData.results[i]._id == oData.strTrackId) {
                    _this.oTracksData.results.splice(i, 1);
                    break;
                }
            }
            console.log("After Delete Track ", _this.oTracksData.results);
        });
        this.socket.on('sDeleteGenre', function (oData) {
            //Remove Genre in Track
            for (var i = 0; i < _this.oTracksData.results.length; i++) {
                for (var j = 0; j < _this.oTracksData.results[i].genres.length; j++) {
                    if (_this.oTracksData.results[i].genres[j]._id == oData.strGenreId) {
                        _this.oTracksData.results[i].genres.splice(j, 1);
                        break;
                    }
                }
            }
            //Find the genre by id in arrGenres and remove it from arrGenres
            for (var i = 0; i < _this.arrGenres.length; i++) {
                if (_this.arrGenres[i]._id == oData.strGenreId) {
                    _this.arrGenres.splice(i, 1);
                    break;
                }
                else {
                    console.log(_this.arrGenres[i]._id + " " + oData.strGenreId);
                }
            }
            console.log("After Delete Genre ", _this.arrGenres, _this.oTracksData.results);
        });
        this.socket.on('sTrackEdited', function (oData) {
            var oTrack = oData.oTrack;
            //Edit Genre in Track
            for (var i = 0; i < _this.oTracksData.results.length; i++) {
                if (_this.oTracksData.results[i]._id == oTrack._id) {
                    // this.arrGenres.splice(i,1);
                    _this.oTracksData.results[i] = oTrack;
                    break;
                }
            }
            console.log("After Edit Track ", _this.oTracksData.results);
        });
        this.socket.on('newGenre', function (oGenre) {
            console.log("New Genre ", oGenre);
            _this.arrGenres.push(oGenre.oGenre);
            console.log(_this.arrGenres);
        });
        this.socket.on('sGenreEdited', function (oData) {
            var oGenre = oData.oGenre;
            //Edit Genre in Track
            for (var i = 0; i < _this.oTracksData.results.length; i++) {
                for (var j = 0; j < _this.oTracksData.results[i].genres.length; j++) {
                    if (_this.oTracksData.results[i].genres[j]._id == oGenre._id) {
                        _this.oTracksData.results[i].genres[j] = oGenre;
                        break;
                    }
                }
            }
            //Find the genre by id and edit it in arrGenres
            for (var i = 0; i < _this.arrGenres.length; i++) {
                if (_this.arrGenres[i]._id == oGenre._id) {
                    // this.arrGenres.splice(i,1);
                    _this.arrGenres[i] = oGenre;
                    break;
                }
            }
            console.log("After Edit Genre ", _this.arrGenres);
        });
    }
    TrackListComponent.prototype.ngOnInit = function () {
        this.getTracks();
        this.getGenres();
    };
    TrackListComponent.prototype.showAddTrackForm = function () {
        $("#add-track-form").show();
        $("#show-add-track-form-btn").hide();
    };
    TrackListComponent.prototype.hideAddTrackForm = function () {
        $("#add-track-form").hide();
        $("#show-add-track-form-btn").show();
        this.hideAddTrackLoading();
    };
    TrackListComponent.prototype.showEditTrackForm = function (strTrackId) {
        $("#track-details-" + strTrackId).hide();
        $("#form-edit-track-" + strTrackId).show();
    };
    TrackListComponent.prototype.hideEditTrackForm = function (strTrackId) {
        $("#track-details-" + strTrackId).show();
        $("#form-edit-track-" + strTrackId).hide();
        this.hideLoading(strTrackId);
    };
    TrackListComponent.prototype.showLoading = function (strTrackId) {
        $("#edit-track-loading-" + strTrackId).show();
    };
    TrackListComponent.prototype.hideLoading = function (strTrackId) {
        $("#edit-track-loading-" + strTrackId).hide();
    };
    TrackListComponent.prototype.showAddTrackLoading = function () {
        $("#add-track-loading").show();
    };
    TrackListComponent.prototype.hideAddTrackLoading = function () {
        $("#add-track-loading").hide();
    };
    //Check if genreId is in Array of Genres
    TrackListComponent.prototype.isGenreInGenres = function (strGenreId, arrGenres) {
        for (var i = 0; i < arrGenres.length; i++) {
            if (arrGenres[i]._id == strGenreId) {
                return true;
            }
        }
        return false;
    };
    TrackListComponent.prototype.searchTrack = function (e) {
        e.preventDefault();
        var elForm = $("#search-track-form");
        var strSearch = elForm.find('input[name="searchTrack"]').val();
        // console.log("Find ", strSearch);
        this.searchTracksByTitle(strSearch);
    };
    TrackListComponent.prototype.searchTracksByTitle = function (strTitle) {
        var _this = this;
        this.tracksService.getTracksByTitle(strTitle).subscribe(function (oTracksData) {
            _this.oTracksData = oTracksData;
        });
    };
    TrackListComponent.prototype.getTracks = function (strUrl) {
        var _this = this;
        strUrl = strUrl ? strUrl : '';
        this.tracksService.getTracks(strUrl).subscribe(function (oTracksData) {
            _this.oTracksData = oTracksData;
        });
    };
    TrackListComponent.prototype.getGenres = function () {
        var _this = this;
        this.genresService.getGenres().subscribe(function (oGenresData) {
            _this.arrGenres = oGenresData.results;
        });
    };
    TrackListComponent.prototype.addNewTrackSubmit = function (e) {
        e.preventDefault();
        // console.log("Form Submitted");
        var elForm = $("#add-track-form");
        var strTitle = elForm.find("input[name='title']").val();
        // console.log("Title ",strTitle);
        var arrGenres = [];
        elForm.find("select[name='genres'] :selected").map(function () {
            arrGenres.push({
                _id: $(this).attr('strGenreId'),
                name: $(this).attr('strGenreName')
            });
        });
        // console.log(arrGenres);
        var numRating = elForm.find("input[name='rating']").val();
        // console.log("numRating ",numRating);
        if (strTitle != "" && arrGenres.length > 0 && numRating != "") {
            var oTrack = {
                title: strTitle,
                genres: arrGenres,
                ratings: numRating
            };
            //Add track to db
            this.addTrack(oTrack);
            this.showAddTrackLoading();
        }
    };
    TrackListComponent.prototype.editTrackSubmit = function (e, strTrackId) {
        e.preventDefault();
        var elForm = $("#form-edit-track-" + strTrackId);
        var strTitle = elForm.find("input[name='title']").val();
        // console.log("Title ",strTitle);
        var arrGenres = [];
        elForm.find("select[name='genres'] :selected").map(function () {
            arrGenres.push({
                _id: $(this).attr('strGenreId'),
                name: $(this).attr('strGenreName')
            });
        });
        // console.log(arrGenres);
        var numRating = elForm.find("input[name='rating']").val();
        // console.log("numRating ",numRating);
        if (strTitle != "" && arrGenres.length > 0 && numRating != "") {
            var oTrack = {
                title: strTitle,
                genres: arrGenres,
                ratings: numRating
            };
            //Edit track 
            this.editTrack(strTrackId, oTrack);
            this.showLoading(strTrackId);
        }
    };
    TrackListComponent.prototype.addTrack = function (oTrack) {
        var _this = this;
        this.tracksService.addTrack(oTrack).subscribe(function (data) {
            // console.log(data);
            _this.socket.emit('addTrack', data);
            //Reset the form
            $("#add-track-form")[0].reset();
            //hideAddTrackForm
            _this.hideAddTrackForm();
        });
    };
    TrackListComponent.prototype.editTrack = function (strTrackId, oTrack) {
        var _this = this;
        this.tracksService.editTrack(strTrackId, oTrack).subscribe(function (oUpdatedTrack) {
            _this.socket.emit('cEditTrack', oUpdatedTrack);
            //hideAddTrackForm
            _this.hideEditTrackForm(strTrackId);
        });
    };
    TrackListComponent.prototype.deleteTrack = function (strTrackId) {
        var _this = this;
        this.tracksService.deleteTrack(strTrackId).subscribe(function (data) {
            if (data.status == 200) {
                _this.socket.emit('cDeleteTrack', strTrackId);
            }
        });
    };
    TrackListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'track-list',
            templateUrl: 'trackListTemplate.html',
            styleUrls: ['styles.css'],
            providers: [tracks_service_1.TracksService, genres_service_1.GenresService]
        }), 
        __metadata('design:paramtypes', [tracks_service_1.TracksService, genres_service_1.GenresService])
    ], TrackListComponent);
    return TrackListComponent;
}());
exports.TrackListComponent = TrackListComponent;
//# sourceMappingURL=tracklist.component.js.map