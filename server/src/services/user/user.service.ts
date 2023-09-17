import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthService } from "src/auth/services/auth.service";
import { LoginResponse } from "src/schemas/dto/loginResponse";
import { UserLogin } from "src/schemas/dto/userLogin";
import { UserRegister } from "src/schemas/dto/userRegister";
import { User } from "src/schemas/user.schema";

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name) private userModel: Model<User>,
		private authService: AuthService
	) {}

	async getAll(): Promise<User[]> {
		return await this.userModel.find({}, { password: 0 }).exec();
	}

	async getById(id: string): Promise<User> {
		return await this.userModel.findById(id, { password: 0 }).exec();
	}

	async getByEmail(email: string): Promise<User> {
		return await this.userModel.findOne({ email: email }, { password: 0 });
	}

	async create(userRegisterDto: UserRegister): Promise<User> {
		const newUser = new this.userModel(userRegisterDto);
		return await newUser.save();
	}

	async update(id: string, user: User): Promise<User> {
		return await this.userModel.findByIdAndUpdate(id, user, { new: true });
	}

	async delete(id: string): Promise<object> {
		return await this.userModel.deleteOne({ _id: id });
	}

	async login(user: UserLogin): Promise<LoginResponse> {
		const userCheck = await this.userModel.findOne({ email: user.email });

		if (userCheck) {
			const passwordCheck: boolean =
				await this.authService.comparePassword(
					user.password,
					userCheck.password
				);

			if (passwordCheck) {
				const userRestricted = await this.getByEmail(user.email);
				const jwtToken =
					await this.authService.generateJwtToken(userCheck);
				return {
					token: jwtToken,
					user: userRestricted,
					expiresIn: 100000,
				};
			} else {
				throw new HttpException(
					"Credenziali non valide",
					HttpStatus.UNAUTHORIZED
				);
			}
		} else {
			throw new HttpException("Utente non trovato", HttpStatus.NOT_FOUND);
		}
	}

	async register(user: UserRegister): Promise<User> {
		const userCheck = await this.getByEmail(user.email);

		if (!userCheck) {
			user.password = await this.authService.hashPassword(user.password);

			const newUser = await this.create(user);
			return this.getByEmail(newUser.email);
		} else {
			throw new HttpException(
				"Utente già esistente",
				HttpStatus.CONFLICT
			);
		}
	}
}
