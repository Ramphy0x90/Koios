import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Book } from "src/schemas/book.schema";
import * as path from "path";
import { Worksheet } from "exceljs";

const ExcelJS = require("exceljs");

@Injectable()
export class BookSeedService {
	constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

	async seedData() {
		const filePath = path.join(process.cwd(), "src/db/DoppioniCDE.xlsx");
		const workbook = new ExcelJS.Workbook();
		const content = await workbook.xlsx.readFile(filePath);
		const worksheet: Worksheet = content.worksheets[1];
		const totalRows = worksheet.rowCount;

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
