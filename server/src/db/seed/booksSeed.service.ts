import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Book } from "src/schemas/book.schema";
import * as path from "path";
import { Worksheet } from "exceljs";
import { Author } from "src/schemas/author.schema";

const ExcelJS = require("exceljs");

@Injectable()
export class BookSeedService {
	constructor(
		@InjectModel(Book.name) private bookModel: Model<Book>,
		@InjectModel(Author.name) private authorModel: Model<Author>
	) {}

	async seedData() {
		const filePath = path.join(process.cwd(), "src/db/DoppioniCDE.xlsx");
		const workbook = new ExcelJS.Workbook();
		const content = await workbook.xlsx.readFile(filePath);
		const worksheet: Worksheet = content.worksheets[1];
		const totalRows = worksheet.rowCount;

		let books: Book[] = [];

		for (const row of worksheet.getRows(1, totalRows)) {
			const authors = await this.authorModel
				.find({ oldSourceRef: row.getCell(2).value?.toString() || "" })
				.exec();

			let authorsIds = authors.map((author) => author.id);
			let title = row.getCell(3).value?.toString() || "-";
			let year = row.getCell(4).value?.valueOf();
			let topic = row.getCell(5).value?.toString() || "";
			let notes =
				(row.getCell(7).value?.toString() || "") +
				"\n" +
				(row.getCell(8).value?.toString() || "");

			console.log(authorsIds);

			const book = {
				requestor: [],
				authors: authorsIds,
				title: title,
				year: !Number.isNaN(Number(year)) ? Number(year) : null,
				topic: topic,
				place: undefined,
				notes: notes,
			};

			books.push(<Book>book);
		}

		await this.bookModel.deleteMany({});
		await this.bookModel.create(books);
	}
}
