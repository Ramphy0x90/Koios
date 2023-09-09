import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Author } from "src/schemas/author.schema";

@Injectable()
export class AuthorService {
	constructor(@InjectModel(Author.name) private authorModel: Model<Author>) {}

	async getAll(): Promise<Author[]> {
		return await this.authorModel.find().exec();
	}

	async getById(id: string): Promise<Author> {
		return await this.authorModel.findById(id).exec();
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

	async delete(id: string): Promise<void> {
		await this.authorModel.deleteOne({ _id: id });
	}
}
