import { Component, OnInit } from '@angular/core';
import { GenresService } from './genres.service'
import { Genre } from './model/Genre'
import { Genres } from './model/Genres'
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Component({
  moduleId: module.id,
  selector: 'genres',
  templateUrl: 'genresTemplate.html',
  styleUrls: ['styles.css'],
  providers: [GenresService]
})

export class GenresComponent implements OnInit { 
	private socket : any;
	private oGenresData : Genres;

	constructor(private genresService: GenresService) {
		this.socket = io.connect();

		this.socket.on('newGenre',(oGenre:Genre) => {
			console.log("New Genre ", oGenre);
			this.oGenresData.results.push(oGenre.oGenre);
			console.log(this.oGenresData.results);
		})

		this.socket.on('sGenreEdited',(oData: Object) => {
			//Find the genre by id and remove it from oGenresData.results
			let oGenre = oData.oGenre;
			for(var i = 0; i< this.oGenresData.results.length; i++ ){
				if(this.oGenresData.results[i]._id == oGenre._id) {
					// this.arrGenres.splice(i,1);
					this.oGenresData.results[i] = oGenre;
					break;
				} 
			}
			console.log("After Edit Genre ", this.oGenresData.results);
		});

		this.socket.on('sDeleteGenre',(oData: Object) => {
			//Find the genre by id and remove it from arrGenres
			for(var i = 0; i< this.oGenresData.results.length; i++ ){
				if(this.oGenresData.results[i]._id == oData.strGenreId) {
					this.oGenresData.results.splice(i,1);
					break;
				} else {
					console.log(this.oGenresData.results[i]._id + " " + oData.strGenreId);
				}
			}
			console.log("After Delete Genre ", this.oGenresData.results);
		});
	}

	ngOnInit() {
		this.getInitGenres();
	}

	showAddGenreForm() {
		$("#add-genre-form").show();
		$("#show-add-genre-form-btn").hide();
	}

	hideAddGenreForm() {
		$("#add-genre-form").hide();
		$("#show-add-genre-form-btn").show();
	}
	
	showEditGenreForm(strGenreId : string) {
		$("#genre-details-"+strGenreId).hide();
		$("#form-edit-genre-"+strGenreId).show();
	}

	hideEditGenreForm(strGenreId : string) {
		$("#genre-details-"+strGenreId).show();
		$("#form-edit-genre-"+strGenreId).hide();
		this.hideLoading();
	}

	showLoading(strGenreId : string) {
		$("#loading-"+strGenreId).show();
	}

	hideLoading(strGenreId : string) {
		$("#loading-"+strGenreId).hide();
	}

	getInitGenres() {
		this.genresService.getGenresFirstPage().subscribe(oGenresData => {
			// console.log(oGenresData);
			this.oGenresData = oGenresData
		});
	}

	getGenres(strUrl : string) {
		
		strUrl = strUrl? strUrl : '';

		this.genresService.getGenres(strUrl).subscribe(oGenresData => {
			console.log(oGenresData);
			this.oGenresData = oGenresData
		});
	}

	addNewGenreSubmit(e: Event) {
		e.preventDefault();
		console.log("Form Submitted");
		let elForm = $("#add-genre-form");

		let strName = elForm.find("input[name='name']").val();
		console.log("Name ",strName);

		if(strName != "") {
			let oGenre: Genre = {
				name: strName
			}

			//Add track to db
			this.addGenre(oGenre);
			//Reset the form
			$("#add-genre-form")[0].reset();
			//hideAddTrackForm
			this.hideAddGenreForm();
		}
	}

	editGenreSubmit(e: Event, strGenreId: string) {
		e.preventDefault();
		console.log("Edit Genre ",strGenreId);

		let elForm = $("#form-edit-genre-"+strGenreId);
		let strName = elForm.find("input[name='name']").val();
		
		if(strName != "") {
			let oGenre = {
				_id: strGenreId,
				name: strName
			}
			this.editGenre(strGenreId,oGenre);
			this.showLoading(strGenreId);
			// this.hideEditGenreForm(strGenreId);
		}

	}

	addGenre(oGenre: Genre) {
		console.log("Add Genre");
			
		this.genresService.addGenre(oGenre).subscribe(data => {
			console.log(data);
			this.socket.emit('addGenre',data);
		});
	}

	editGenre(strGenreId: string,oGenre: Genre) {
		console.log("In Edit Genre");

		this.genresService.editGenre(strGenreId, oGenre).subscribe(data => {
			console.log("After Edit data ",data);
			this.socket.emit('cEditGenre', oGenre);
			this.hideEditGenreForm(strGenreId);
		})
	}

	deleteGenre(strGenreId: string) {
		console.log("Delete ",strGenreId);
		this.genresService.deleteGenre(strGenreId).subscribe(data => {
			// console.log("After Delete data ",data);
			if(data.status == 200) {
				this.socket.emit('cDeleteGenre', strGenreId);
			}
		})
	}

}
