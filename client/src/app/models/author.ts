import { Book } from "./book";
import { DBData } from "./dbData";

export interface Author extends DBData {
	name: string;
	surname: string;
	books?: Book[];
}
