import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidTokenException extends HttpException {
	constructor() {
		super("Token non valido", HttpStatus.UNAUTHORIZED);
	}
}
