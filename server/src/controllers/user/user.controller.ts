import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Post,
	Put,
	Res,
} from "@nestjs/common";
import { UserService } from "src/services/user/user.service";
import { Response } from "express";
import { User } from "src/schemas/user.schema";
import { LoginResponse } from "src/schemas/dto/loginResponse";

@Controller("api/v1/user")
export class UserController {
	constructor(private userService: UserService) {}

	@Get()
	fetchAll(@Res({ passthrough: true }) res: Response): Promise<User[]> {
		res.status(HttpStatus.OK);
		return this.userService.getAll();
	}

	@Get(":id")
	getUserById(
		@Res({ passthrough: true }) res: Response,
		@Param("id") id: string
	): Promise<User> {
		res.status(HttpStatus.OK);
		return this.userService.getById(id);
	}

	@Post("create")
	createUser(
		@Res({ passthrough: true }) res: Response,
		@Body() user
	): Promise<User> {
		res.status(HttpStatus.CREATED);
		return this.userService.create(user);
	}

	@Put(":id")
	updateUser(
		@Res({ passthrough: true }) res: Response,
		@Param("id") id: string,
		@Body() user
	): Promise<User> {
		res.status(HttpStatus.OK);
		return this.userService.update(id, user);
	}

	@Delete(":id")
	deleteUser(
		@Res({ passthrough: true }) res: Response,
		@Param("id") id: string
	): Promise<object> {
		res.status(HttpStatus.OK);
		return this.userService.delete(id);
	}

	@Post("login")
	login(
		@Res({ passthrough: true }) res: Response,
		@Body() user
	): Promise<LoginResponse> {
		res.status(HttpStatus.CREATED);
		return this.userService.login(user);
	}

	@Post("register")
	register(
		@Res({ passthrough: true }) res: Response,
		@Body() user
	): Promise<User> {
		res.status(HttpStatus.CREATED);
		return this.userService.register(user);
	}
}
