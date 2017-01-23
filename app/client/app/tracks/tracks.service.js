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
var TracksService = (function () {
    //All CRUD operation for Track in this Service 
    function TracksService(http) {
        this.http = http;
        console.log("Tracks service initialized");
    }
    //For Search.
    //Process and forward to getTracks() 
    TracksService.prototype.getTracksByTitle = function (strTitle) {
        var strUrl = '/v1/tracks?title=' + strTitle;
        return this.getTracks(strUrl);
    };
    //Make request and get return of type Tracks
    TracksService.prototype.getTracks = function (strUrl) {
        strUrl = strUrl ? encodeURI(strUrl) : '/v1/tracks';
        return this.http.get(strUrl).map(function (res) { return res.json(); });
    };
    //Add a track Object
    TracksService.prototype.addTrack = function (oTrack) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post("/v1/tracks", JSON.stringify(oTrack), { headers: headers }).map(function (res) { return res.json(); });
    };
    //Edit track with id :strTrackId
    TracksService.prototype.editTrack = function (strTrackId, oTrack) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post("/v1/track/" + strTrackId, JSON.stringify(oTrack), { headers: headers }).map(function (res) { return res.json(); });
    };
    TracksService.prototype.deleteTrack = function (strTrackId) {
        return this.http.delete("/v1/track/" + strTrackId);
    };
    TracksService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], TracksService);
    return TracksService;
}());
exports.TracksService = TracksService;
//# sourceMappingURL=tracks.service.js.map