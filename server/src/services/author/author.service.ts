import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Author } from "src/schemas/author.schema";

@Injectable()
export class AuthorService {
	constructor(@InjectModel(Author.name) private authorModel: Model<Author>) {}

	async getAll(): Promise<Author[]> {
		return await this.authorModel.find().populate("books").exec();
	}

	async search(term: string): Promise<Author[]> {
		let result = this.authorModel.find();
		let regex = new RegExp(term, "i");

		result.where({
			$or: [{ name: regex }, { surname: regex }],
		});

		return await result.exec();
	}

	async getById(id: string): Promise<Author> {
		return await this.authorModel.findById(id).populate("books").exec();
	}

	async create(authorDto): Promise<Author> {
		const newBook = new this.authorModel(authorDto);
		return await newBook.save();
	}

	async update(id: string, author: Author): Promise<Author> {
		return await this.authorModel.findByIdAndUpdate(id, author, {
			new: true,
		});
	}

	async delete(id: string): Promise<object> {
		return await this.authorModel.deleteOne({ _id: id });
	}
}
