import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { InvalidTokenException } from "src/auth/exceptions/invalidToken.exception";
import { AuthService } from "src/auth/services/auth.service";
import { GuestToken } from "src/schemas/dto/guestToken";
import { GuestTokenRequest } from "src/schemas/dto/guestTokenRequest";
import { ValidateTokenResponse } from "src/schemas/dto/validateTokenResponse";
import { Guest } from "src/schemas/guest.schema";

@Injectable()
export class GuestService {
	constructor(
		@InjectModel(Guest.name) private guestModel: Model<Guest>,
		private authService: AuthService
	) {}

	async getAll(): Promise<Guest[]> {
		return await this.guestModel.find({}).exec();
	}

	async getById(id: string): Promise<Guest> {
		return await this.guestModel.findById(id).exec();
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

	async validateToken(tokenId: string): Promise<ValidateTokenResponse> {
		let token = null;

		try {
			token = await this.guestModel.findById(tokenId).exec();
		} catch {
			throw new InvalidTokenException();
		}

		const isValid =
			token && (await this.authService.verifyJwt(token.token));

		return { token: token.token, isValid: !!isValid };
	}

	async deleteToken(id: string): Promise<object> {
		return await this.guestModel.deleteOne({ _id: id });
	}
}
