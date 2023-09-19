import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Author } from "src/schemas/author.schema";

@Injectable()
export class AuthorSeedService {
	constructor(@InjectModel(Author.name) private authorModel: Model<Author>) {}

	async seedData() {
		const defaultData = [
			{
				name: "VV",
				surname: "AA",
			},
			{
				name: "Colette",
				surname: "Abegg-Mengold",
			},
			{
				name: "Fritz",
				surname: "Aeppli",
			},
			{
				name: "Armando",
				surname: "Aghina",
			},
			{
				name: "Mario",
				surname: "Agliati",
			},
			{
				name: "Jaakko",
				surname: "Ahokas",
			},
			{
				name: "ALEPO",
				surname: "",
			},
			{
				name: "ALP",
				surname: "",
			},
			{
				name: "Marco",
				surname: "Baer",
			},
		];

		await this.authorModel.deleteMany({});
		await this.authorModel.create(defaultData);
	}
}
