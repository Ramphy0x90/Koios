import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Book } from "src/schemas/book.schema";
import _ from "lodash";
import { LogService } from "../log/log.service";
import { Log } from "src/schemas/log.schema";
import * as path from "path";
import { Worksheet } from "exceljs";

const ExcelJS = require("exceljs");

@Injectable()
export class BookService {
	constructor(
		@InjectModel(Book.name) private bookModel: Model<Book>,
		private logService: LogService
	) {}

	async getAll(from: number, limit: number): Promise<Book[]> {
		const query = this.bookModel.find();

		if (limit > 0) {
			query.skip(from).limit(limit);
		}

		return await query.exec();
	}

	async search(term: string): Promise<Book[]> {
		let result = this.bookModel.find();
		let regex = new RegExp(term, "i");

		result.where({
			$or: [
				{ requestor: { $in: [regex] } },
				{ authors: regex },
				{ title: regex },
				{ topic: regex },
				{ notes: regex },
			],
		});

		return await result.exec();
	}

	async filter(term: string): Promise<Book[]> {
		let result = this.bookModel.find();

		if (term == "booksNoRequestors") {
			result.where({ requestor: { $size: 0 } });
		} else if (term == "booksRequestor") {
			result.where({ requestor: { $not: { $size: 0 } } });
		} else if (term == "booksDisabled") {
			result.where({ status: false });
		}

		return await result.exec();
	}

	async getById(id: string): Promise<Book> {
		return await this.bookModel.findById(id).exec();
	}

	async create(bookDto): Promise<Book> {
		bookDto.author = bookDto.author == "" ? null : bookDto.author;
		bookDto.place = bookDto.place == "" ? null : bookDto.place;

		const newBook = new this.bookModel(bookDto);
		await this.logService.create(<Log>{
			entity: "Book",
			target: "",
			operation: "CREATE",
			changes: "",
		});

		return await newBook.save();
	}

	async update(id: string, book: Book): Promise<Book> {
		await this.logService.create(<Log>{
			entity: "Book",
			target: id,
			operation: "UPDATE",
			changes: "",
		});

		return await this.bookModel.findByIdAndUpdate(id, book, { new: true });
	}

	async delete(id: string): Promise<object> {
		await this.logService.create(<Log>{
			entity: "Book",
			target: id,
			operation: "DELETE",
			changes: "",
		});

		return await this.bookModel.deleteOne({ _id: id });
    }
    
    async import(file) {
        console.log(file)
		const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer);
		const worksheet: Worksheet = workbook.worksheets[1];
        const totalRows = worksheet.rowCount;
        
        console.log(worksheet)

		let books: Book[] = [];

		for (const row of worksheet.getRows(1, totalRows)) {
			let authors = row.getCell(2).value?.toString() || "-";
			let title = row.getCell(3).value?.toString() || "-";
			let year = row.getCell(4).value?.valueOf();
			let topic = row.getCell(5).value?.toString() || "";
			let place = row.getCell(6).value?.toString() || "";
			let notes =
				(row.getCell(7).value?.toString() || "") +
				"\n" +
				(row.getCell(8).value?.toString() || "");

			const book = {
				status: true,
				requestor: [],
				authors: authors,
				title: title,
				year: !Number.isNaN(Number(year)) ? Number(year) : null,
				topic: topic,
				place: place,
				notes: notes,
			};

			books.push(<Book>book);
		}

		await this.bookModel.deleteMany({});
		await this.bookModel.create(books);
	}
}
