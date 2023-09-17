import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Book } from "src/schemas/book.schema";
import _ from "lodash";

@Injectable()
export class BookService {
	constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

	async getAll(): Promise<Book[]> {
		return await this.bookModel.find().populate("authorInfo").exec();
	}

	async search(term: string): Promise<Book[]> {
		let result = this.bookModel.find();
		let regex = new RegExp(term, "i");

		result.where({
			$or: [
				{ requestor: { $in: [regex] } },
				{ title: regex },
				{ topic: regex },
				{ notes: regex },
			],
		});

		return await result.exec();
	}

	async getById(id: string): Promise<Book> {
		return await (await this.bookModel.findById(id))
			.populated("authorInfo")
			.exec();
	}

	async create(bookDto): Promise<Book> {
		bookDto.author = bookDto.author == "" ? null : bookDto.author;
		bookDto.place = bookDto.place == "" ? null : bookDto.place;

		const newBook = new this.bookModel(bookDto);
		return await newBook.save();
	}

	async update(id: string, book: Book): Promise<Book> {
		return await this.bookModel.findByIdAndUpdate(id, book, { new: true });
	}

	async delete(id: string): Promise<object> {
		return await this.bookModel.deleteOne({ _id: id });
	}
}
