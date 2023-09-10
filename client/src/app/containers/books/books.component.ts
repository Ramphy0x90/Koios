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
		requestor: [],
		author: "",
		title: "",
		year: new Date().getFullYear(),
		topic: "",
		place: "",
		notes: "",
	};

	selectedBook: Book | BookDto = this.bookTemplate;
	draftBookVersion: Book = <Book>this.selectedBook;

	constructor(private bookService: BookService) {}

	ngOnInit(): void {
		this.fetchBooks();
	}

	setMode(mode: UserMode): void {
		switch (mode) {
			case UserMode.NEW:
				this.selectedBook = { ...this.bookTemplate };
				break;
			case UserMode.EDIT:
				this.draftBookVersion = { ...(<Book>this.selectedBook) };
				break;
			case UserMode.READ:
				this.selectedBook = this.books[0];
				break;
		}

		this.mode = mode;
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
			.updateBook(this.draftBookVersion._id, this.draftBookVersion)
			.pipe(take(1))
			.subscribe((data) => {
				this.fetchBooks();
				this.selectedBook = data;
				this.mode = UserMode.READ;
			});
	}

	saveBook(): void {
		if (this.mode == UserMode.NEW) {
			this.bookService
				.createBook(this.selectedBook)
				.pipe(take(1))
				.subscribe((data) => {
					this.mode = UserMode.READ;
					this.selectedBook = { ...data };
					this.fetchBooks();
				});
		} else if (this.mode == UserMode.EDIT) {
			this.updateBook();
		}
	}

	deleteBook(): void {
		this.bookService.deleteBook((<Book>this.selectedBook)._id);
		this.fetchBooks();
		this.selectedBook =
			this.books.length > 0 ? this.books[0] : this.bookTemplate;
	}

	export(): void {}

	cancelOperation(): void {
		if (this.mode == UserMode.EDIT) {
			this.draftBookVersion = <Book>this.selectedBook;
		} else if (this.mode == UserMode.NEW) {
			this.selectedBook = { ...this.books[0] };
		}

		this.mode = UserMode.READ;
	}
}
