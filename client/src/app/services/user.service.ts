import { Injectable } from "@angular/core";
import { UserLogin } from "../models/userLogin";
import { UserRegister } from "../models/userRegister";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { User } from "../models/user";
import { LoginResponse } from "../models/loginResponse";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment.prod";

@Injectable({
	providedIn: "root",
})
export class UserService {
	private readonly API_URI = "api/v1/user";
	private readonly logged$: BehaviorSubject<boolean> = new BehaviorSubject(
		false
	);

	readonly isLogged$: Observable<boolean> = this.logged$.asObservable();

	constructor(private httpClient: HttpClient) {
		this.checkIfUserLogged();
	}

	login(user: UserLogin): Observable<LoginResponse> {
		return this.httpClient
			.post<LoginResponse>(
				`${environment.server}/${this.API_URI}/login`,
				user
			)
			.pipe(
				tap((res: LoginResponse) => {
					localStorage.setItem("token", res.token);
					this.logged$.next(true);
				})
			);
	}

	register(user: UserRegister): Observable<User> {
		return this.httpClient.post<User>(
			`${environment.server}/${this.API_URI}/register`,
			user
		);
	}

	logOut(): void {
		localStorage.removeItem("token");
		this.logged$.next(false);
	}

	getUserToken(): string {
		return localStorage.getItem("token") || "";
	}

	checkIfUserLogged(): void {
		if (localStorage.getItem("token")) {
			this.logged$.next(true);
		} else {
			this.logged$.next(false);
		}
	}
}
