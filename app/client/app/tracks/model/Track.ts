import { Genre } from '../../genres/model/Genre';

export class Track {
	_id? : string;
	title: string;
	genres: Array<Genre>;
	ratings: string;
};