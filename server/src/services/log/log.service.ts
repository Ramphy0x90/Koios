import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthService } from "src/auth/services/auth.service";
import { Log } from "src/schemas/log.schema";
import { User } from "src/schemas/user.schema";

@Injectable()
export class LogService {
	currentLoggedUser: User;

	constructor(
		@InjectModel(Log.name) private logModel: Model<Log>,
		private authService: AuthService
	) {
		this.authService.loggedUser$.subscribe((user) => {
			this.currentLoggedUser = user;
		});
	}

	async getAll(): Promise<Log[]> {
		return await this.logModel.find().exec();
	}

	async create(log): Promise<Log> {
		const newLog = new this.logModel(log);
		newLog.executer = this.currentLoggedUser?.email || "";

		return await newLog.save();
	}
}
