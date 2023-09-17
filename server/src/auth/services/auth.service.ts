import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/schemas/user.schema";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
	constructor(private jwtService: JwtService) {}

	async generateJwtToken(user: User): Promise<string> {
		return this.jwtService.signAsync({ user });
	}

	async hashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, 6);
	}

	async comparePassword(
		password: string,
		passwordHash: string
	): Promise<boolean> {
		return bcrypt.compare(password, passwordHash);
	}

	async verifyJwt(token: string): Promise<object> {
		return this.jwtService.verifyAsync(token);
	}
}
