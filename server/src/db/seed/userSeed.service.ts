import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthService } from "src/auth/services/auth.service";
import { User } from "src/schemas/user.schema";

@Injectable()
export class UserSeedService {
	constructor(
		@InjectModel(User.name) private userModel: Model<User>,
		private authService: AuthService
	) {}

	async seedData() {
		const password = await this.authService.hashPassword("password");

		const defaultData = [
			{
				name: "Admin",
				surname: "Admin",
				email: "admin@admin.com",
				password: password,
			},
		];

		await this.userModel.deleteMany({});
		await this.userModel.create(defaultData);
	}
}
