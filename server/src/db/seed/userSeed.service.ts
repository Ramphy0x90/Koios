import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthService } from "src/auth/services/auth.service";
import { User } from "src/schemas/user.schema";
import * as path from "path";
import { Row } from "exceljs";
const ExcelJS = require("exceljs");

@Injectable()
export class UserSeedService {
	constructor(
		@InjectModel(User.name) private userModel: Model<User>,
		private authService: AuthService
	) {}

	async getDataFromFile(): Promise<void> {
		// const filePath = path.resolve(__dirname, "../DoppioniCDE.xlsx");
		// const workbook = new ExcelJS.Workbook();
		// const content = await workbook.xlsx.readFile(filePath);
		// const worksheet = content.worksheets[1];
		// const rows: Row[] = worksheet.getRows(1, 7) ?? [];
		// console.log(rows[0].getCell[0]);
	}

	async seedData() {
		this.getDataFromFile();
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
