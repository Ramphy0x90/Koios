import { DBData } from "./dbData";

export interface User extends DBData {
	name: string;
	surname: string;
	email: string;
}
