import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Book } from "../models/book";
import { environment } from "src/environments/environment";

@Injectable()
export class BookService {
    private readonly API_URI = "api/v1/book";

    constructor(private httpClient: HttpClient) { }

    getAll(from: number = 0, limit: number = -1): Observable<Book[]> {
        return this.httpClient.get<Book[]>(
            `${environment.server}/${this.API_URI}/all/${from}/${limit}`
        );
    }

    getAllCount(): Observable<number> {
        return this.httpClient.get<number>(`${environment.server}/${this.API_URI}/count`);
    }

    searchBook(term: string): Observable<Book[]> {
        return this.httpClient.get<Book[]>(
            `${environment.server}/${this.API_URI}/search/${term}`
        );
    }

    filterBooks(term: string): Observable<Book[]> {
        return this.httpClient.get<Book[]>(
            `${environment.server}/${this.API_URI}/filter/${term}`
        );
    }

    getBookById(id: string): Observable<Book> {
        return this.httpClient.get<Book>(
            `${environment.server}/${this.API_URI}/${id}`
        );
    }

    createBook(book: Book): Observable<Book> {
        return this.httpClient.post<Book>(
            `${environment.server}/${this.API_URI}/create`,
            book
        );
    }

    updateBook(book: Book): Observable<Book> {
        const bookId = book._id;

        return this.httpClient.put<Book>(
            `${environment.server}/${this.API_URI}/${bookId}`,
            book
        );
    }

    deleteBook(id: string): Observable<object> {
        return this.httpClient.delete(
            `${environment.server}/${this.API_URI}/${id}`
        );
    }

    uploadExcelFile(file: File, append: boolean = false): Observable<Book[]> {
        const formData = new FormData();
        formData.append('excelFile', file);
        formData.append('append', append.toString());

        return this.httpClient.post<Book[]>(
            `${environment.server}/${this.API_URI}/upload`,
            formData
        );
    }

    bookedBooksReport(guest: string): Observable<BlobPart> {
        return this.httpClient.get(
            `${environment.server}/${this.API_URI}/booked-report/${guest}`,
            { responseType: 'blob' }
        );
    }
}
