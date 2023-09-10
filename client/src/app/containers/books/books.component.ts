import { Component, OnInit } from "@angular/core";
import { take } from "rxjs";
import { InspectModel } from "src/app/components/inspector/inspector.component";
import { Book } from "src/app/models/book";
import { BookDto } from "src/app/models/bookDto";
import { BookService } from "src/app/services/book.service";

export enum UserMode {
	READ,
	NEW,
	EDIT,
}

@Component({
	selector: "app-books",
	templateUrl: "./books.component.html",
	styleUrls: ["./books.component.css"],
})
export class BooksComponent implements OnInit {
	inspectModel = InspectModel;
	userMode = UserMode;
	mode = UserMode.READ;

	books: Book[] = [];
	bookTemplate: BookDto = {
		requestor: "",
		author: "",
		title: "",
		year: new Date().getFullYear(),
		topic: "",
		place: "",
		notes: "",
	};
	selectedBook: Book | BookDto = this.bookTemplate;

	constructor(private bookService: BookService) {}

	ngOnInit(): void {
		this.fetchBooks();
	}

	setMode(mode: UserMode): void {
		this.mode = mode;

		switch (mode) {
			case UserMode.NEW:
				this.selectedBook = { ...this.bookTemplate };
				break;
			case UserMode.EDIT:
				break;
			case UserMode.READ:
				this.selectedBook = this.books[0];
				break;
		}
	}

	setBook(book: Book): void {
		this.selectedBook = book || this.bookTemplate;
	}

	fetchBooks(): void {
		this.bookService
			.getAll()
			.pipe(take(1))
			.subscribe((data) => {
				this.books = data;
			});
	}

	updateBook(): void {
		this.bookService
			.updateBook((<Book>this.selectedBook)._id, this.selectedBook)
			.pipe(take(1))
			.subscribe((data) => {
				this.selectedBook = data;
				this.mode = UserMode.READ;
			});
	}

	submit(): void {
		if (this.mode == UserMode.NEW) {
			this.bookService
				.createBook(this.selectedBook)
				.pipe(take(1))
				.subscribe((data) => {
					this.selectedBook = data;
					this.mode = UserMode.READ;
					this.fetchBooks();
				});
		} else if (this.mode == UserMode.EDIT) {
			this.updateBook();
		}
	}
}
