import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/schemas/user.schema";
import * as bcrypt from "bcrypt";
import { BehaviorSubject, Observable } from "rxjs";
import { ExpiredTokenException } from "../exceptions/expiredToken.exception";
import { GuestTokenRequest } from "src/schemas/dto/guestTokenRequest";

@Injectable()
export class AuthService {
	private readonly user$: BehaviorSubject<User> = new BehaviorSubject(null);
	readonly loggedUser$: Observable<User> = this.user$.asObservable();

	constructor(private jwtService: JwtService) {}

	async generateJwtToken(user: User): Promise<string> {
		return this.jwtService.signAsync({ user });
	}

	async generateGuestJwtToken(guest: GuestTokenRequest): Promise<string> {
		const currentDate = new Date();
		const expiresInMilliseconds =
			new Date(guest.expirationDate).getTime() - currentDate.getTime();
		const expiresInSeconds = Math.floor(expiresInMilliseconds / 1000);

		return await this.jwtService.signAsync(
			{ guest: guest.guest, generation: currentDate },
			{ expiresIn: expiresInSeconds }
		);
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
		try {
			return await this.jwtService.verifyAsync(token);
		} catch {
			throw new ExpiredTokenException();
		}
	}

	setLoggedUser(user: User): void {
		this.user$.next(user);
	}
}
