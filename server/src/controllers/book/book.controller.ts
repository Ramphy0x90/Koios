import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Param,
	Body,
	Res,
	HttpStatus,
	UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { Book } from "src/schemas/book.schema";
import { BookService } from "src/services/book/book.service";

@Controller("api/v1/book")
export class BookController {
	constructor(private bookService: BookService) {}

	@Get()
	fetchAll(@Res({ passthrough: true }) res: Response): Promise<Book[]> {
		res.status(HttpStatus.OK);
		return this.bookService.getAll();
	}

	@Get("search/:term")
	searchBook(
		@Res({ passthrough: true }) res: Response,
		@Param("term") term: string
	): Promise<Book[]> {
		res.status(HttpStatus.OK);
		return this.bookService.search(term);
	}

	@Get(":id")
	getBookById(
		@Res({ passthrough: true }) res: Response,
		@Param("id") id: string
	): Promise<Book> {
		res.status(HttpStatus.OK);
		return this.bookService.getById(id);
	}

	@UseGuards(AuthGuard)
	@Post("create")
	createBook(
		@Res({ passthrough: true }) res: Response,
		@Body() book
	): Promise<Book> {
		res.status(HttpStatus.CREATED);
		return this.bookService.create(book);
	}

	@Put(":id")
	updateBook(
		@Res({ passthrough: true }) res: Response,
		@Param("id") id: string,
		@Body() book
	): Promise<Book> {
		res.status(HttpStatus.OK);
		return this.bookService.update(id, book);
	}

	@UseGuards(AuthGuard)
	@Delete(":id")
	deleteBook(
		@Res({ passthrough: true }) res: Response,
		@Param("id") id: string
	): Promise<object> {
		res.status(HttpStatus.OK);
		return this.bookService.delete(id);
	}
}
