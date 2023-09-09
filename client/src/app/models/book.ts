export interface Book {
	requestor: string;
	author: string;
	title: string;
	year: number;
	topic: string;
	place: string;
	notes_1: string;
	notes_2: string;
	createdAt?: Date;
	updatedAt?: Date;
}
