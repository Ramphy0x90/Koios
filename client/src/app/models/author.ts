import { DBData } from "./dbData";

export interface Author extends DBData {
	name: string;
	surname: string;
}
