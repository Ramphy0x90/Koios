import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Log } from "../models/log";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
	providedIn: "root",
})
export class LogsService {
	private readonly API_URI = "api/v1/log";

	constructor(private httpClient: HttpClient) {}

	getAll(): Observable<Log[]> {
		return this.httpClient.get<Log[]>(
			`${environment.server}/${this.API_URI}`
		);
	}
}
