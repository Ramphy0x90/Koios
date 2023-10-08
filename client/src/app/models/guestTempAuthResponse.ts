import { DBData } from "./dbData";

export interface GuestTempAuthResponse extends DBData {
	guest: string;
	token: string;
	expiration: Date;
}
