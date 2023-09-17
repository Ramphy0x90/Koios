import { Injectable } from "@angular/core";
import { UserLogin } from "../models/userLogin";
import { UserRegister } from "../models/userRegister";
import { Observable, tap } from "rxjs";
import { User } from "../models/user";
import { LoginResponse } from "../models/loginResponse";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment.prod";

@Injectable({
	providedIn: "root",
})
export class UserService {
	private readonly API_URI = "api/v1/user";

	constructor(private httpClient: HttpClient) {}

	login(user: UserLogin): Observable<LoginResponse> {
		return this.httpClient
			.post<LoginResponse>(
				`${environment.server}/${this.API_URI}/login`,
				user
			)
			.pipe(
				tap((res: LoginResponse) =>
					localStorage.setItem("token", res.token)
				)
			);
	}

	register(user: UserRegister): Observable<User> {
		return this.httpClient.post<User>(
			`${environment.server}/${this.API_URI}/register`,
			user
		);
	}
}
