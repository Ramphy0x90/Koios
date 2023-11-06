import { DBData } from "./dbData";

export interface Book extends DBData {
	status: boolean;
	requestor: string[];
	authors: string;
	title: string;
	year: number;
	topic: string;
	place: string;
    notes1: string;
    notes2: string;
}
