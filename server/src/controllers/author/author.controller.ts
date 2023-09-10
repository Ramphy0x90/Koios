import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Res,
	HttpStatus,
	Param,
	Body,
} from "@nestjs/common";
import { AuthorService } from "src/services/author/author.service";
import { Response } from "express";
import { Author } from "src/schemas/author.schema";

@Controller("api/v1/author")
export class AuthorController {
	constructor(private authorService: AuthorService) {}

	@Get()
	fetchAll(@Res({ passthrough: true }) res: Response): Promise<Author[]> {
		res.status(HttpStatus.OK);
		return this.authorService.getAll();
	}

	@Get(":id")
	getAuthorById(
		@Res({ passthrough: true }) res: Response,
		@Param("id") id: string
	): Promise<Author> {
		res.status(HttpStatus.OK);
		return this.authorService.getById(id);
	}

	@Post("create")
	createAuthor(
		@Res({ passthrough: true }) res: Response,
		@Body() author
	): Promise<Author> {
		res.status(HttpStatus.CREATED);
		return this.authorService.create(author);
	}

	@Put(":id")
	updateAuthor(
		@Res({ passthrough: true }) res: Response,
		@Param("id") id: string,
		@Body() author
	): Promise<Author> {
		res.status(HttpStatus.OK);
		return this.authorService.update(id, author);
	}

	@Delete(":id")
	deleteAuthor(
		@Res({ passthrough: true }) res: Response,
		@Param(":id") id: string
	): Promise<Author[]> {
		this.authorService.delete(id);
		res.status(HttpStatus.GONE);
		return this.authorService.getAll();
	}
}