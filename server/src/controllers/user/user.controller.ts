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
	UseGuards,
} from "@nestjs/common";
import { UserService } from "src/services/user/user.service";
import { Response } from "express";
import { User } from "src/schemas/user.schema";
import { LoginResponse } from "src/schemas/dto/loginResponse";
import { AuthGuard } from "src/auth/guards/auth.guard";

@Controller("api/v1/user")
export class UserController {
	constructor(private userService: UserService) {}

	@UseGuards(AuthGuard)
	@Get()
	fetchAll(@Res({ passthrough: true }) res: Response): Promise<User[]> {
		res.status(HttpStatus.OK);
		return this.userService.getAll();
	}

	@UseGuards(AuthGuard)
	@Get(":id")
	getUserById(
		@Res({ passthrough: true }) res: Response,
		@Param("id") id: string
	): Promise<User> {
		res.status(HttpStatus.OK);
		return this.userService.getById(id);
	}

	@UseGuards(AuthGuard)
	@Post("create")
	createUser(
		@Res({ passthrough: true }) res: Response,
		@Body() user
	): Promise<User> {
		res.status(HttpStatus.CREATED);
		return this.userService.create(user);
	}

	@UseGuards(AuthGuard)
	@Put(":id")
	updateUser(
		@Res({ passthrough: true }) res: Response,
		@Param("id") id: string,
		@Body() user
	): Promise<User> {
		res.status(HttpStatus.OK);
		return this.userService.update(id, user);
	}

	@UseGuards(AuthGuard)
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
