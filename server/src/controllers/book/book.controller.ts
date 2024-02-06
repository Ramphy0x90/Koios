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
    UseInterceptors,
    UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { Book } from "src/schemas/book.schema";
import { BookService } from "src/services/book/book.service";

@Controller("api/v1/book")
export class BookController {
    constructor(private bookService: BookService) { }

    @Get("all/:from?/:limit?")
    fetchAll(
        @Res({ passthrough: true }) res: Response,
        @Param("from") from: number = 0,
        @Param("limit") limit: number = -1
    ): Promise<Book[]> {
        res.status(HttpStatus.OK);
        return this.bookService.getAll(from, limit);
    }

    @Get("search/:term")
    searchBook(
        @Res({ passthrough: true }) res: Response,
        @Param("term") term: string
    ): Promise<Book[]> {
        res.status(HttpStatus.OK);
        return this.bookService.search(term);
    }

    @Get("filter/:term")
    filterBooks(
        @Res({ passthrough: true }) res: Response,
        @Param("term") term: string
    ): Promise<Book[]> {
        res.status(HttpStatus.OK);
        return this.bookService.filter(term);
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

    @UseGuards(AuthGuard)
    @Post("upload")
    @UseInterceptors(FileInterceptor('excelFile'))
    uploadExcel(
        @Res({ passthrough: true }) res: Response,
        @UploadedFile() file,
        @Body('append') append: boolean
    ): Promise<object> {
        this.bookService.import(file, append);
        res.status(HttpStatus.OK);
        return Promise.resolve({});
    }
}
