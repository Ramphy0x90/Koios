import { DBData } from "./dbData";

export interface Book extends DBData {
	requestor: string[];
	author: string;
	title: string;
	year: number;
	topic: string;
	place: string;
	notes: string;
}
