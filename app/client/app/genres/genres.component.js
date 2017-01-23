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
var genres_service_1 = require('./genres.service');
var io = require('socket.io-client');
var GenresComponent = (function () {
    function GenresComponent(genresService) {
        var _this = this;
        this.genresService = genresService;
        this.socket = io.connect();
        this.socket.on('newGenre', function (oGenre) {
            console.log("New Genre ", oGenre);
            _this.oGenresData.results.push(oGenre.oGenre);
            console.log(_this.oGenresData.results);
        });
        this.socket.on('sGenreEdited', function (oData) {
            //Find the genre by id and remove it from oGenresData.results
            var oGenre = oData.oGenre;
            for (var i = 0; i < _this.oGenresData.results.length; i++) {
                if (_this.oGenresData.results[i]._id == oGenre._id) {
                    // this.arrGenres.splice(i,1);
                    _this.oGenresData.results[i] = oGenre;
                    break;
                }
            }
            console.log("After Edit Genre ", _this.oGenresData.results);
        });
        this.socket.on('sDeleteGenre', function (oData) {
            //Find the genre by id and remove it from arrGenres
            for (var i = 0; i < _this.oGenresData.results.length; i++) {
                if (_this.oGenresData.results[i]._id == oData.strGenreId) {
                    _this.oGenresData.results.splice(i, 1);
                    break;
                }
                else {
                    console.log(_this.oGenresData.results[i]._id + " " + oData.strGenreId);
                }
            }
            console.log("After Delete Genre ", _this.oGenresData.results);
        });
    }
    GenresComponent.prototype.ngOnInit = function () {
        this.getInitGenres();
    };
    GenresComponent.prototype.showAddGenreForm = function () {
        $("#add-genre-form").show();
        $("#show-add-genre-form-btn").hide();
    };
    GenresComponent.prototype.hideAddGenreForm = function () {
        $("#add-genre-form").hide();
        $("#show-add-genre-form-btn").show();
    };
    GenresComponent.prototype.showEditGenreForm = function (strGenreId) {
        $("#genre-details-" + strGenreId).hide();
        $("#form-edit-genre-" + strGenreId).show();
    };
    GenresComponent.prototype.hideEditGenreForm = function (strGenreId) {
        $("#genre-details-" + strGenreId).show();
        $("#form-edit-genre-" + strGenreId).hide();
        this.hideLoading();
    };
    GenresComponent.prototype.showLoading = function (strGenreId) {
        $("#loading-" + strGenreId).show();
    };
    GenresComponent.prototype.hideLoading = function (strGenreId) {
        $("#loading-" + strGenreId).hide();
    };
    GenresComponent.prototype.getInitGenres = function () {
        var _this = this;
        this.genresService.getGenresFirstPage().subscribe(function (oGenresData) {
            // console.log(oGenresData);
            _this.oGenresData = oGenresData;
        });
    };
    GenresComponent.prototype.getGenres = function (strUrl) {
        var _this = this;
        strUrl = strUrl ? strUrl : '';
        this.genresService.getGenres(strUrl).subscribe(function (oGenresData) {
            console.log(oGenresData);
            _this.oGenresData = oGenresData;
        });
    };
    GenresComponent.prototype.addNewGenreSubmit = function (e) {
        e.preventDefault();
        console.log("Form Submitted");
        var elForm = $("#add-genre-form");
        var strName = elForm.find("input[name='name']").val();
        console.log("Name ", strName);
        if (strName != "") {
            var oGenre = {
                name: strName
            };
            //Add track to db
            this.addGenre(oGenre);
            //Reset the form
            $("#add-genre-form")[0].reset();
            //hideAddTrackForm
            this.hideAddGenreForm();
        }
    };
    GenresComponent.prototype.editGenreSubmit = function (e, strGenreId) {
        e.preventDefault();
        console.log("Edit Genre ", strGenreId);
        var elForm = $("#form-edit-genre-" + strGenreId);
        var strName = elForm.find("input[name='name']").val();
        if (strName != "") {
            var oGenre = {
                _id: strGenreId,
                name: strName
            };
            this.editGenre(strGenreId, oGenre);
            this.showLoading(strGenreId);
        }
    };
    GenresComponent.prototype.addGenre = function (oGenre) {
        var _this = this;
        console.log("Add Genre");
        this.genresService.addGenre(oGenre).subscribe(function (data) {
            console.log(data);
            _this.socket.emit('addGenre', data);
        });
    };
    GenresComponent.prototype.editGenre = function (strGenreId, oGenre) {
        var _this = this;
        console.log("In Edit Genre");
        this.genresService.editGenre(strGenreId, oGenre).subscribe(function (data) {
            console.log("After Edit data ", data);
            _this.socket.emit('cEditGenre', oGenre);
            _this.hideEditGenreForm(strGenreId);
        });
    };
    GenresComponent.prototype.deleteGenre = function (strGenreId) {
        var _this = this;
        console.log("Delete ", strGenreId);
        this.genresService.deleteGenre(strGenreId).subscribe(function (data) {
            // console.log("After Delete data ",data);
            if (data.status == 200) {
                _this.socket.emit('cDeleteGenre', strGenreId);
            }
        });
    };
    GenresComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'genres',
            templateUrl: 'genresTemplate.html',
            styleUrls: ['styles.css'],
            providers: [genres_service_1.GenresService]
        }), 
        __metadata('design:paramtypes', [genres_service_1.GenresService])
    ], GenresComponent);
    return GenresComponent;
}());
exports.GenresComponent = GenresComponent;
//# sourceMappingURL=genres.component.js.map