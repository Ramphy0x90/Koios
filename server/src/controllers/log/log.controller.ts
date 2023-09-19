import { Controller, Get, HttpStatus, Res } from "@nestjs/common";
import { LogService } from "src/services/log/log.service";
import { Response } from "express";
import { Log } from "src/schemas/log.schema";

@Controller("api/v1/log")
export class LogController {
	constructor(private logService: LogService) {}

	@Get()
	fetchAll(@Res({ passthrough: true }) res: Response): Promise<Log[]> {
		res.status(HttpStatus.OK);
		return this.logService.getAll();
	}
}
