import { Injectable } from '@angular/core';
import { Http , Headers } from '@angular/http';
import { Genre } from './model/Genre'
import { Genres } from './model/Genres'
import 'rxjs/add/operator/map';

@Injectable()
export class GenresService {

	//All CRUD operation for Genre in this Service 

	constructor(private http:Http) {
		console.log("GenresService service initialized");
	}

	//Set ?page=1 to request
	getGenresFirstPage() {
		let strUrl = '/v1/genres?page=1';
		return this.getGenres(strUrl);
	}

	//get all genres or filter by page in url
	getGenres(strUrl : string) {
		if(strUrl) {
			strUrl = encodeURI(strUrl);
			return this.http.get(strUrl).map(res=>res.json());
		} else {
			return this.http.get('/v1/genres').map(res=>res.json());
		}
	}

	//Add a genre Object
	addGenre(oGenre: Genre ) {
		// console.log("In GenresService add Genre");
		let headers = new Headers();
		headers.append('Content-Type','application/json');
		return this.http.post("/v1/genres", JSON.stringify(oGenre), {headers : headers}).map(res => {
			console.log(res);
			if(res.status == 200 ) {
				console.log(res.json());
			}
			return res.json();
		});

	}

	//edit with genre id :strGenreId
	
	editGenre(strGenreId: string,oGenre: Genre) {
		// console.log("edit id to ",oGenre);

		let headers = new Headers();
		headers.append('Content-Type','application/json');
	
		return this.http.post("/v1/genres/"+strGenreId, JSON.stringify(oGenre), {headers : headers}).map(res => res.json());
	}

	deleteGenre(strGenreId: string) {
		return this.http.delete("/v1/genre/"+strGenreId);
	}
}
