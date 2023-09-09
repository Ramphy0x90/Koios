import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Book } from "src/schemas/book.schema";

@Injectable()
export class BookService {
	constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

	async getAll(): Promise<Book[]> {
		return await this.bookModel.find().exec();
	}

	async getById(id: string): Promise<Book> {
		return await this.bookModel.findById(id).exec();
	}

	async create(bookDto): Promise<Book> {
		const newBook = new this.bookModel(bookDto);
		return await newBook.save();
	}

	async update(id: string, book: Book): Promise<Book> {
		return await this.bookModel.findByIdAndUpdate(id, book, { new: true });
	}

	async delete(id: string): Promise<void> {
		await this.bookModel.deleteOne({ _id: id });
	}
}
