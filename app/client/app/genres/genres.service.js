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
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
var GenresService = (function () {
    //All CRUD operation for Genre in this Service 
    function GenresService(http) {
        this.http = http;
        console.log("GenresService service initialized");
    }
    //Set ?page=1 to request
    GenresService.prototype.getGenresFirstPage = function () {
        var strUrl = '/v1/genres?page=1';
        return this.getGenres(strUrl);
    };
    //get all genres or filter by page in url
    GenresService.prototype.getGenres = function (strUrl) {
        if (strUrl) {
            strUrl = encodeURI(strUrl);
            return this.http.get(strUrl).map(function (res) { return res.json(); });
        }
        else {
            return this.http.get('/v1/genres').map(function (res) { return res.json(); });
        }
    };
    //Add a genre Object
    GenresService.prototype.addGenre = function (oGenre) {
        // console.log("In GenresService add Genre");
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post("/v1/genres", JSON.stringify(oGenre), { headers: headers }).map(function (res) {
            console.log(res);
            if (res.status == 200) {
                console.log(res.json());
            }
            return res.json();
        });
    };
    //edit with genre id :strGenreId
    GenresService.prototype.editGenre = function (strGenreId, oGenre) {
        // console.log("edit id to ",oGenre);
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post("/v1/genres/" + strGenreId, JSON.stringify(oGenre), { headers: headers }).map(function (res) { return res.json(); });
    };
    GenresService.prototype.deleteGenre = function (strGenreId) {
        return this.http.delete("/v1/genre/" + strGenreId);
    };
    GenresService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], GenresService);
    return GenresService;
}());
exports.GenresService = GenresService;
//# sourceMappingURL=genres.service.js.map