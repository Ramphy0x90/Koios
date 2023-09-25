import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Book } from "src/schemas/book.schema";

@Injectable()
export class BookSeedService {
	constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

	async seedData() {
		const defaultData = [
			{
				requestor: ["Ramphy"],
				author: null,
				title: "Book 1",
				year: 2001,
				topic: "Test book 1",
				place: null,
				notes: "",
			},
			{
				requestor: ["Alexander"],
				author: null,
				title: "Book 2",
				year: 1923,
				topic: "Test book 2",
				place: null,
				notes: "Test create",
			},
			{
				requestor: ["Aquino"],
				author: null,
				title: "Book 1",
				year: 2023,
				topic: "Test book 3",
				place: null,
				notes: "Test update",
			},
			{
				requestor: ["Nova"],
				author: null,
				title: "Book 4",
				year: 2013,
				topic: "Test book 4",
				place: null,
				notes: "Test delete",
			},
		];

		await this.bookModel.deleteMany({});
		await this.bookModel.create(defaultData);
	}
}
