import { Component, OnInit } from '@angular/core';
import { TracksService } from '../tracks.service'
import { GenresService } from './../../genres/genres.service'
import { Track } from '../model/Track'
import { Tracks } from '../model/Tracks'
import { Genre } from '../../genres/model/Genre'
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Component({
  moduleId: module.id,
  selector: 'track-list',
  templateUrl: 'trackListTemplate.html',
  styleUrls: ['styles.css'],
  providers: [TracksService, GenresService]
})

export class TrackListComponent implements OnInit { 
	private socket : any;
	private arrGenres : Genre[];
	private oTracksData : Tracks;

	constructor(private tracksService: TracksService, private genresService: GenresService) {
		this.socket = io.connect();

		this.socket.on('newTrack',(oData:Object) => {
			console.log("New Track ", oData);
			this.oTracksData.results.push(oData.oTrack);
			console.log(this.oTracksData.results);
		})

		this.socket.on('sDeleteTrack',(oData: Object) => {
			//Find the track by id and remove it from oTracksData.results
			for(var i = 0; i< this.oTracksData.results.length; i++ ){
				if(this.oTracksData.results[i]._id == oData.strTrackId) {
					this.oTracksData.results.splice(i,1);
					break;
				}
			}
			console.log("After Delete Track ", this.oTracksData.results);
		});
		
		this.socket.on('sDeleteGenre',(oData: Object) => {
			
			//Remove Genre in Track
			for(var i = 0; i< this.oTracksData.results.length; i++ ){
				for(var j = 0 ; j< this.oTracksData.results[i].genres.length; j++ ){
					if(this.oTracksData.results[i].genres[j]._id == oData.strGenreId) {
						this.oTracksData.results[i].genres.splice(j,1);
						break;
					}
				}
			}

			//Find the genre by id in arrGenres and remove it from arrGenres
			for(var i = 0; i< this.arrGenres.length; i++ ){
				if(this.arrGenres[i]._id == oData.strGenreId) {
					this.arrGenres.splice(i,1);
					break;
				} else {
					console.log(this.arrGenres[i]._id + " " + oData.strGenreId);
				}
			}
			console.log("After Delete Genre ", this.arrGenres, this.oTracksData.results);
		});

		this.socket.on('sTrackEdited',(oData: Object) => {
			let oTrack = oData.oTrack;
			
			//Edit Genre in Track
			for(var i = 0; i< this.oTracksData.results.length; i++ ){
				if(this.oTracksData.results[i]._id == oTrack._id) {
					// this.arrGenres.splice(i,1);
					this.oTracksData.results[i] = oTrack;
					break;
				} 
			}
			console.log("After Edit Track ", this.oTracksData.results);
		});

		this.socket.on('newGenre',(oGenre:Genre) => {
			console.log("New Genre ", oGenre);
			this.arrGenres.push(oGenre.oGenre);
			console.log(this.arrGenres);
		});

		this.socket.on('sGenreEdited',(oData: Object) => {
			let oGenre = oData.oGenre;
			
			//Edit Genre in Track
			for(var i = 0; i< this.oTracksData.results.length; i++ ){
				for(var j = 0 ; j< this.oTracksData.results[i].genres.length; j++ ){
					if(this.oTracksData.results[i].genres[j]._id == oGenre._id) {
						this.oTracksData.results[i].genres[j] = oGenre;
						break;
					}
				}
			}

			//Find the genre by id and edit it in arrGenres
			for(var i = 0; i< this.arrGenres.length; i++ ){
				if(this.arrGenres[i]._id == oGenre._id) {
					// this.arrGenres.splice(i,1);
					this.arrGenres[i] = oGenre;
					break;
				} 
			}
			console.log("After Edit Genre ", this.arrGenres);
		});
	}

	ngOnInit() {
		this.getTracks();
		this.getGenres();
	}

	showAddTrackForm() {
		$("#add-track-form").show();
		$("#show-add-track-form-btn").hide();
	}

	hideAddTrackForm() {
		$("#add-track-form").hide();
		$("#show-add-track-form-btn").show();
		this.hideAddTrackLoading();
	}

	showEditTrackForm(strTrackId : string) {
		$("#track-details-"+strTrackId).hide();
		$("#form-edit-track-"+strTrackId).show();
	}

	hideEditTrackForm(strTrackId : string) {
		$("#track-details-"+strTrackId).show();
		$("#form-edit-track-"+strTrackId).hide();
		this.hideLoading(strTrackId);
	}

	showLoading(strTrackId : string) {
		$("#edit-track-loading-"+strTrackId).show();
	}

	hideLoading(strTrackId : string) {
		$("#edit-track-loading-"+strTrackId).hide();
	}

	showAddTrackLoading() {
		$("#add-track-loading").show();
	}

	hideAddTrackLoading() {
		$("#add-track-loading").hide();
	}

	//Check if genreId is in Array of Genres
	isGenreInGenres(strGenreId : string, arrGenres: Array<Genre>) {
		for(var i=0; i < arrGenres.length; i++) {
			if(arrGenres[i]._id == strGenreId) {
				return true;
			} 
		}
		return false;
	}

	searchTrack(e: Event) {
		e.preventDefault();
		let elForm = $("#search-track-form");
		let strSearch = elForm.find('input[name="searchTrack"]').val();
		// console.log("Find ", strSearch);

		this.searchTracksByTitle(strSearch);
	}

	searchTracksByTitle(strTitle :string) {
		this.tracksService.getTracksByTitle(strTitle).subscribe(oTracksData => {
			this.oTracksData = oTracksData;
		});
	}

	getTracks(strUrl : string) {
		
		strUrl = strUrl? strUrl : '';

		this.tracksService.getTracks(strUrl).subscribe(oTracksData => {
			this.oTracksData = oTracksData;
		});
	}
	
	getGenres() {
		this.genresService.getGenres().subscribe(oGenresData => {
			this.arrGenres = oGenresData.results;
		});
	}

	addNewTrackSubmit(e: Event) {
		e.preventDefault();
		// console.log("Form Submitted");
		let elForm = $("#add-track-form");

		let strTitle = elForm.find("input[name='title']").val();
		// console.log("Title ",strTitle);

		let arrGenres:Array<Genre> = [];
		
		elForm.find("select[name='genres'] :selected").map(function(){
			arrGenres.push({
				_id : $(this).attr('strGenreId'),
				name : $(this).attr('strGenreName')				
			});
		});
		// console.log(arrGenres);

		let numRating = elForm.find("input[name='rating']").val();
		// console.log("numRating ",numRating);

		if(strTitle != "" && arrGenres.length>0 && numRating != "") {
			let oTrack: Track = {
				title: strTitle,
				genres: arrGenres,
				ratings: numRating
			}

			//Add track to db
			this.addTrack(oTrack);
			
			this.showAddTrackLoading();
		}
	}

	editTrackSubmit(e: Event, strTrackId: string) {
		e.preventDefault();

		let elForm = $("#form-edit-track-"+strTrackId);
		let strTitle = elForm.find("input[name='title']").val();
		// console.log("Title ",strTitle);

		let arrGenres:Array<Genre> = [];
		
		elForm.find("select[name='genres'] :selected").map(function(){
			arrGenres.push({
				_id : $(this).attr('strGenreId'),
				name : $(this).attr('strGenreName')				
			});
		});
		// console.log(arrGenres);

		let numRating = elForm.find("input[name='rating']").val();
		// console.log("numRating ",numRating);

		if(strTitle != "" && arrGenres.length>0 && numRating != "") {
			let oTrack: Track = {
				title: strTitle,
				genres: arrGenres,
				ratings: numRating
			}

			//Edit track 
			this.editTrack(strTrackId,oTrack);
			this.showLoading(strTrackId);
		}
	}

	addTrack(oTrack: Track) {
			
		this.tracksService.addTrack(oTrack).subscribe(data => {
			// console.log(data);
			this.socket.emit('addTrack',data);
			//Reset the form
			$("#add-track-form")[0].reset();
			//hideAddTrackForm
			this.hideAddTrackForm();
		});
	}

	editTrack(strTrackId: string,oTrack: Track) {

		this.tracksService.editTrack(strTrackId, oTrack).subscribe(oUpdatedTrack => {
			this.socket.emit('cEditTrack', oUpdatedTrack);
			//hideAddTrackForm
			this.hideEditTrackForm(strTrackId);
		})
	}

	deleteTrack(strTrackId: string) {
		this.tracksService.deleteTrack(strTrackId).subscribe(data => {
			if(data.status == 200) {
				this.socket.emit('cDeleteTrack', strTrackId);
			}
		})
	}
}
