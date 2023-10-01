import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GuestTempAuthResponse } from "../models/guestTempAuthResponse";
import { environment } from "src/environments/environment";

@Injectable({
	providedIn: "root",
})
export class GuestService {
	private readonly API_URI = "api/v1/guest";

	constructor(private httpClient: HttpClient) {}

	generateToken(): Observable<GuestTempAuthResponse> {
		return this.httpClient.get<GuestTempAuthResponse>(
			`${environment.server}/${this.API_URI}/token`
		);
	}

	validateToken(token: string): Observable<GuestTempAuthResponse> {
		return this.httpClient.get<GuestTempAuthResponse>(
			`${environment.server}/${this.API_URI}/validate/${token}`
		);
	}
}
