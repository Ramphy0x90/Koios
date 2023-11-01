import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GuestTempAuthResponse } from "../models/guestTempAuthResponse";
import { environment } from "src/environments/environment";
import { GuestTokenRequest } from "../models/guestTokenRequest";
import { ValidateTokenResponse } from "../models/validateTokenResponse";
import _ from "lodash";

@Injectable({
	providedIn: "root",
})
export class GuestService {
	private readonly API_URI = "api/v1/guest";

	constructor(private httpClient: HttpClient) {}

	getAll(): Observable<GuestTempAuthResponse[]> {
		return this.httpClient.get<GuestTempAuthResponse[]>(
			`${environment.server}/${this.API_URI}`
		);
	}

	getGuestById(id: string): Observable<GuestTempAuthResponse> {
		return this.httpClient.get<GuestTempAuthResponse>(
			`${environment.server}/${this.API_URI}/${id}`
		);
    }

	getCurrentToken(): string {
		return window.localStorage.getItem("guestToken") || "";
	}

	generateToken(guest: GuestTokenRequest): Observable<GuestTempAuthResponse> {
		return this.httpClient.post<GuestTempAuthResponse>(
			`${environment.server}/${this.API_URI}/token`,
			guest
		);
	}

	validateToken(token: string): Observable<ValidateTokenResponse> {
		return this.httpClient.get<ValidateTokenResponse>(
			`${environment.server}/${this.API_URI}/validate/${token}`
		);
	}

	deleteToken(id: string): Observable<object> {
		return this.httpClient.delete<GuestTempAuthResponse>(
			`${environment.server}/${this.API_URI}/${id}`
		);
	}
}
