import { Injectable } from '@angular/core';
import { Http , Headers } from '@angular/http';
import { Track } from './model/Track'
import { Tracks } from './model/Tracks'
import 'rxjs/add/operator/map';

@Injectable()
export class TracksService {

	//All CRUD operation for Track in this Service 

	constructor(private http:Http) {
		console.log("Tracks service initialized");
	}

	//For Search.
	//Process and forward to getTracks() 
	getTracksByTitle(strTitle : string) {
		let strUrl = '/v1/tracks?title='+strTitle;
		return this.getTracks(strUrl);
	}

	//Make request and get return of type Tracks
	getTracks(strUrl : string) {
		strUrl = strUrl ? encodeURI(strUrl) : '/v1/tracks';
		return this.http.get(strUrl).map(res=>res.json());
	}

	//Add a track Object
	addTrack(oTrack: Track ) {
		let headers = new Headers();
		headers.append('Content-Type','application/json');
		return this.http.post("/v1/tracks", JSON.stringify(oTrack), {headers : headers}).map(res => res.json());
	}

	//Edit track with id :strTrackId
	editTrack(strTrackId: string,oTrack: any) {
		let headers = new Headers();
		headers.append('Content-Type','application/json');

		return this.http.post("/v1/track/"+strTrackId, JSON.stringify(oTrack), {headers : headers}).map(res => res.json());
	}

	deleteTrack(strTrackId: string) {
		return this.http.delete("/v1/track/"+strTrackId);
	}
}
