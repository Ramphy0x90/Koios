import { HttpException, HttpStatus } from "@nestjs/common";

export class ExpiredTokenException extends HttpException {
	constructor() {
		super("Sessione scaduta", HttpStatus.UNAUTHORIZED);
	}
}
