import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Author } from "src/schemas/author.schema";
import { LogService } from "../log/log.service";
import { Log } from "src/schemas/log.schema";

@Injectable()
export class AuthorService {
	constructor(
		@InjectModel(Author.name) private authorModel: Model<Author>,
		private logService: LogService
	) {}

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
		const newAuthor = new this.authorModel(authorDto);
		await this.logService.create(<Log>{
			entity: "Author",
			target: "",
			operation: "CREATE",
			changes: "",
		});

		return await newAuthor.save();
	}

	async update(id: string, author: Author): Promise<Author> {
		await this.logService.create(<Log>{
			entity: "Author",
			target: id,
			operation: "UPDATE",
			changes: "??",
		});

		return await this.authorModel.findByIdAndUpdate(id, author, {
			new: true,
		});
	}

	async delete(id: string): Promise<object> {
		await this.logService.create(<Log>{
			entity: "Author",
			target: id,
			operation: "DELETE",
			changes: "",
		});

		return await this.authorModel.deleteOne({ _id: id });
	}
}
