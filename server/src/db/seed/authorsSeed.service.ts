import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Author } from "src/schemas/author.schema";
import * as path from "path";
import { Row, Worksheet } from "exceljs";

const ExcelJS = require("exceljs");

@Injectable()
export class AuthorSeedService {
	constructor(@InjectModel(Author.name) private authorModel: Model<Author>) {}

	async seedData() {
		const filePath = path.join(process.cwd(), "src/db/DoppioniCDE.xlsx");
		const workbook = new ExcelJS.Workbook();
		const content = await workbook.xlsx.readFile(filePath);
		const worksheet: Worksheet = content.worksheets[1];

		const authorsDirtySet: { [key: string]: string } = {};
		let authors: Author[] = [];

		worksheet.eachRow((row: Row) => {
			const author = row.getCell(2).value?.toString() || "";

			author.split(";").forEach((subAuthor) => {
				authorsDirtySet[author] = subAuthor.replace(/\s+/g, " ").trim();
			});
		});

		Object.entries(authorsDirtySet).forEach(([oldRef, author]) => {
			const names = author.split(",");
			let name = names[1] || "";
			let surname = names[0] || "";

			if (!name) {
				name = surname;
				surname = "";
			}

			authors.push(<Author>{
				oldSourceRef: oldRef,
				name: name.replace(/\s+/g, " ").trim(),
				surname: surname.replace(/\s+/g, " ").trim(),
			});
		});

		await this.authorModel.deleteMany({});
		await this.authorModel.create(authors);
	}
}
