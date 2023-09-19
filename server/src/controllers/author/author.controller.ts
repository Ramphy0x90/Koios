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
	UseGuards,
} from "@nestjs/common";
import { AuthorService } from "src/services/author/author.service";
import { Response } from "express";
import { Author } from "src/schemas/author.schema";
import { AuthGuard } from "src/auth/guards/auth.guard";

@Controller("api/v1/author")
export class AuthorController {
	constructor(private authorService: AuthorService) {}

	@Get()
	fetchAll(@Res({ passthrough: true }) res: Response): Promise<Author[]> {
		res.status(HttpStatus.OK);
		return this.authorService.getAll();
	}

	@Get("search/:term")
	searchBook(
		@Res({ passthrough: true }) res: Response,
		@Param("term") term: string
	): Promise<Author[]> {
		res.status(HttpStatus.OK);
		return this.authorService.search(term);
	}

	@Get(":id")
	getAuthorById(
		@Res({ passthrough: true }) res: Response,
		@Param("id") id: string
	): Promise<Author> {
		res.status(HttpStatus.OK);
		return this.authorService.getById(id);
	}

	@UseGuards(AuthGuard)
	@Post("create")
	createAuthor(
		@Res({ passthrough: true }) res: Response,
		@Body() author
	): Promise<Author> {
		res.status(HttpStatus.CREATED);
		return this.authorService.create(author);
	}

	@UseGuards(AuthGuard)
	@Put(":id")
	updateAuthor(
		@Res({ passthrough: true }) res: Response,
		@Param("id") id: string,
		@Body() author
	): Promise<Author> {
		res.status(HttpStatus.OK);
		return this.authorService.update(id, author);
	}

	@UseGuards(AuthGuard)
	@Delete(":id")
	deleteAuthor(
		@Res({ passthrough: true }) res: Response,
		@Param("id") id: string
	): Promise<object> {
		res.status(HttpStatus.OK);
		return this.authorService.delete(id);
	}
}
