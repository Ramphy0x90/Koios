import { Author } from "./author";
import { DBData } from "./dbData";

export interface Book extends DBData {
	requestor: string[];
	authors: string[];
	authorInfo?: Author[];
	title: string;
	year: number;
	topic: string;
	place: string;
	notes: string;
}
