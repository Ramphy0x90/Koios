import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GuestTempAuthResponse } from "../models/guestTempAuthResponse";
import { environment } from "src/environments/environment";
import { GuestTokenRequest } from "../models/guestTokenRequest";

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

	generateToken(guest: GuestTokenRequest): Observable<GuestTempAuthResponse> {
		return this.httpClient.post<GuestTempAuthResponse>(
			`${environment.server}/${this.API_URI}/token`,
			guest
		);
	}

	validateToken(token: string): Observable<GuestTempAuthResponse> {
		return this.httpClient.get<GuestTempAuthResponse>(
			`${environment.server}/${this.API_URI}/validate/${token}`
		);
	}
}
