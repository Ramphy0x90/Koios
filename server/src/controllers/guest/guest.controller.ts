import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Post,
	Res,
	UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { GuestToken } from "src/schemas/dto/guestToken";
import { Guest } from "src/schemas/guest.schema";
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

	@Get(":id")
	getTokenById(
		@Res({ passthrough: true }) res: Response,
		@Param("id") id: string
	): Promise<Guest> {
		res.status(HttpStatus.OK);
		return this.guestService.getById(id);
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

	@Get("validate/:token")
	validateToken(
		@Res({ passthrough: true }) res: Response,
		@Param("token") token: string
	): Promise<object> {
		res.status(HttpStatus.OK);
		return this.guestService.validateToken(token);
	}

	@UseGuards(AuthGuard)
	@Delete(":id")
	deleteToken(
		@Res({ passthrough: true }) res: Response,
		@Param("id") id: string
	): Promise<object> {
		res.status(HttpStatus.OK);
		return this.guestService.deleteToken(id);
	}
}
