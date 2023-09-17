import { User } from "../user.schema";

export interface LoginResponse {
	token: string;
	user: User;
	expiresIn: number;
}
