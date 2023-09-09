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
} from "@nestjs/common";
import { Response } from "express";
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

	@Get(":id")
	getBookById(
		@Res({ passthrough: true }) res: Response,
		@Param("id") id: string
	): Promise<Book> {
		res.status(HttpStatus.OK);
		return this.bookService.getById(id);
	}

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

	@Delete(":id")
	deleteBook(
		@Res({ passthrough: true }) res: Response,
		@Param(":id") id: string
	): Promise<Book[]> {
		this.bookService.delete(id);
		res.status(HttpStatus.GONE);
		return this.bookService.getAll();
	}
}
