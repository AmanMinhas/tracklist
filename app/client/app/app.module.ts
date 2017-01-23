import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule } 	 from '@angular/http'

import { AppComponent }  from './app.component';
import { TrackListComponent }  from './tracks/tracklist/tracklist.component';
import { GenresComponent }  from './genres/genres.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpModule ],
  declarations: [ AppComponent, TrackListComponent, GenresComponent ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
