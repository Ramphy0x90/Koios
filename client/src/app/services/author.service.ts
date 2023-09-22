import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Author } from "../models/author";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
	providedIn: "root",
})
export class AuthorService {
	private readonly API_URI = "api/v1/author";

	constructor(private httpClient: HttpClient) {}

	getAll(): Observable<Author[]> {
		return this.httpClient.get<Author[]>(
			`${environment.server}/${this.API_URI}`
		);
	}

	searchAuthor(term: string): Observable<Author[]> {
		return this.httpClient.get<Author[]>(
			`${environment.server}/${this.API_URI}/search/${term}`
		);
	}

	getAuthorById(id: string): Observable<Author> {
		return this.httpClient.get<Author>(
			`${environment.server}/${this.API_URI}/${id}`
		);
	}

	createAuthor(author: Author): Observable<Author> {
		return this.httpClient.post<Author>(
			`${environment.server}/${this.API_URI}/create`,
			author
		);
	}

	updateAuthor(id: string, author: Author): Observable<Author> {
		return this.httpClient.put<Author>(
			`${environment.server}/${this.API_URI}/${id}`,
			author
		);
	}

	deleteAuthor(id: string): void {
		this.httpClient.delete(`${environment.server}/${this.API_URI}/${id}`);
	}
}
