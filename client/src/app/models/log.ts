import { DBData } from "./dbData";

export interface Log extends DBData {
	entity: string;
	target: string;
	operation: string;
	executer: string;
	changes: string;
}
