import { Component } from '@angular/core';
import { TracksService } from './tracks/tracks.service';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: 'appTemplate.html'
})

export class AppComponent  { 
	constructor() {
		console.log("App Component Constructor");
	}
}
