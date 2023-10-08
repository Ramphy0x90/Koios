import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Post,
	Res,
	UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { GuestToken } from "src/schemas/dto/guestToken";
import { Guest } from "src/schemas/guest";
import { GuestService } from "src/services/guest/guest.service";

@Controller("api/v1/guest")
export class GuestController {
	constructor(private guestService: GuestService) {}

	@UseGuards(AuthGuard)
	@Get()
	fetchAll(@Res({ passthrough: true }) res: Response): Promise<Guest[]> {
		res.status(HttpStatus.OK);
		return this.guestService.getAll();
	}

	@UseGuards(AuthGuard)
	@Post("token")
	generateToken(
		@Res({ passthrough: true }) res: Response,
		@Body() guest
	): Promise<GuestToken> {
		res.status(HttpStatus.OK);
		return this.guestService.generateToken(guest);
	}
}
