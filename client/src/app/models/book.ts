import { DBData } from "./dbData";

export interface Book extends DBData {
	requestor: string[];
	authors: string;
	title: string;
	year: number;
	topic: string;
	place: string;
	notes: string;
}
