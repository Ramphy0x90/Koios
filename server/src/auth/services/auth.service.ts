import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/schemas/user.schema";
import * as bcrypt from "bcrypt";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class AuthService {
	private readonly user$: BehaviorSubject<User> = new BehaviorSubject(null);
	readonly loggedUser$: Observable<User> = this.user$.asObservable();

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

	setLoggedUser(user: User): void {
		this.user$.next(user);
	}
}
