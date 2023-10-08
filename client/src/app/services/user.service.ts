import { Injectable } from "@angular/core";
import { UserLogin } from "../models/userLogin";
import { UserRegister } from "../models/userRegister";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { User } from "../models/user";
import { LoginResponse } from "../models/loginResponse";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
	providedIn: "root",
})
export class UserService {
	private readonly API_URI = "api/v1/user";
	private readonly logged$: BehaviorSubject<boolean> = new BehaviorSubject(
		false
	);

	readonly isLogged$: Observable<boolean> = this.logged$.asObservable();
	isLogged: boolean = false;

	constructor(private httpClient: HttpClient) {
		this.checkIfUserLogged();

		this.isLogged$.subscribe((isLogged) => {
			this.isLogged = isLogged;
		});
	}

	getAll(): Observable<User[]> {
		return this.httpClient.get<User[]>(
			`${environment.server}/${this.API_URI}`
		);
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

	updateUser(user: User): Observable<User> {
		const userId = user._id;

		return this.httpClient.put<User>(
			`${environment.server}/${this.API_URI}/${userId}`,
			user
		);
	}

	deleteUser(id: string): Observable<object> {
		return this.httpClient.delete(
			`${environment.server}/${this.API_URI}/${id}`
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
