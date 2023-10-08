import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthService } from "src/auth/services/auth.service";
import { GuestToken } from "src/schemas/dto/guestToken";
import { GuestTokenRequest } from "src/schemas/dto/guestTokenRequest";
import { Guest } from "src/schemas/guest";

@Injectable()
export class GuestService {
	constructor(
		@InjectModel(Guest.name) private guestModel: Model<Guest>,
		private authService: AuthService
	) {}

	async getAll(): Promise<Guest[]> {
		return await this.guestModel.find({}).exec();
	}

	async generateToken(guest: GuestTokenRequest): Promise<GuestToken> {
		const jwtToken = await this.authService.generateGuestJwtToken(guest);

		const newGuest = new this.guestModel({
			guest: guest.guest,
			token: jwtToken,
			expiration: guest.expirationDate,
		});
		await newGuest.save();

		return {
			token: jwtToken,
		};
	}
}
