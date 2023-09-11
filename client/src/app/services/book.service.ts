import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Book } from "../models/book";
import { environment } from "src/environments/environment.prod";
import { BookDto } from "../models/bookDto";

@Injectable()
export class BookService {
	private readonly API_URI = "api/v1/book";

	constructor(private httpClient: HttpClient) {}

	getAll(): Observable<Book[]> {
		return this.httpClient.get<Book[]>(
			`${environment.server}/${this.API_URI}`
		);
	}

	searchBook(term: string): Observable<Book[]> {
		return this.httpClient.get<Book[]>(
			`${environment.server}/${this.API_URI}/search/${term}`
		);
	}

	getBookById(id: string): Observable<Book> {
		return this.httpClient.get<Book>(
			`${environment.server}/${this.API_URI}/${id}`
		);
	}

	createBook(book: BookDto): Observable<Book> {
		return this.httpClient.post<Book>(
			`${environment.server}/${this.API_URI}/create`,
			book
		);
	}

	updateBook(id: string, book: BookDto): Observable<Book> {
		return this.httpClient.put<Book>(
			`${environment.server}/${this.API_URI}/${id}`,
			book
		);
	}

	deleteBook(id: string): void {
		this.httpClient.delete(`${environment.server}/${this.API_URI}/${id}`);
	}
}
