import { Component, OnInit, Inject } from "@angular/core";
import { take } from "rxjs";
import { InspectorStatus } from "src/app/components/inspector/inspector.component";
import { Book } from "src/app/models/book";
import { BookService } from "src/app/services/book.service";
import * as XLSX from "xlsx";
import { DOCUMENT } from "@angular/common";
import { InspectorData } from "src/app/models/inspectorData";
import {
	Action,
	UserMode,
} from "src/app/components/table-actions/table-actions.component";

@Component({
	selector: "app-books",
	templateUrl: "./books.component.html",
	styleUrls: ["./books.component.css"],
})
export class BooksComponent implements OnInit {
	inspectorStatus = InspectorStatus;
	userMode = UserMode;

	mode = UserMode.READ;
	status = this.inspectorStatus.CLOSED;

	books: Book[] = [];
	bookTemplate: Book = {
		requestor: [],
		authors: "",
		title: "",
		year: new Date().getFullYear(),
		topic: "",
		place: "",
		notes: "",
	};

	selectedBook: Book = this.bookTemplate;
	draftBookVersion: Book = this.selectedBook;

	constructor(
		private bookService: BookService,
		@Inject(DOCUMENT) private document: Document
	) {}

	ngOnInit(): void {
		this.fetchBooks();
	}

	updateMode(mode: UserMode): void {
		switch (mode) {
			case UserMode.READ:
				this.cancelOperation();
				break;
			case UserMode.NEW:
				this.selectedBook = { ...this.bookTemplate };
				this.status = this.inspectorStatus.OPEN;
				break;
			case UserMode.EDIT:
				this.draftBookVersion = { ...this.selectedBook };
				this.status = this.inspectorStatus.OPEN;
				break;
		}

		this.mode = mode;
	}

	handleTableAction(action: Action): void {
		switch (action) {
			case Action.SAVE:
				this.saveBook();
				break;
			case Action.CANCEL:
				this.cancelOperation();
				break;
			case Action.DELETE:
				this.deleteBook();
				break;
			case Action.EXPORT:
				this.export();
				break;
		}
	}

	search(term: string): void {
		this.bookService.searchBook(term).subscribe((data) => {
			this.books = data;
		});
	}

	setBook(book: Book): void {
		this.selectedBook = book || this.bookTemplate;
	}

	getBook(): InspectorData<Book> {
		let book: InspectorData<Book> = {
			type: "Book",
			value:
				this.mode == this.userMode.EDIT
					? this.draftBookVersion
					: this.selectedBook,
		};

		return book;
	}

	fetchBooks(): void {
		this.bookService
			.getAll()
			.pipe(take(1))
			.subscribe((data) => {
				this.books = data;
				this.selectedBook =
					this.books.length > 0 ? this.books[0] : this.bookTemplate;
			});
	}

	updateBook(): void {
		const bookId = this.draftBookVersion?._id || "";

		this.bookService
			.updateBook(bookId, this.draftBookVersion)
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
		const bookId = this.selectedBook?._id || "";
		this.bookService.deleteBook(bookId).subscribe(() => this.fetchBooks());
	}

	export(): void {
		let elt = this.document.querySelector("app-table table");
		let wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
		return XLSX.writeFile(wb, "LibriCDE.xlsx");
	}

	cancelOperation(): void {
		if (this.mode == UserMode.EDIT) {
			this.draftBookVersion = this.selectedBook;
		} else if (this.mode == UserMode.NEW) {
			this.selectedBook = { ...this.books[0] };
		}

		this.mode = UserMode.READ;
		this.status = this.inspectorStatus.CLOSED;
	}
}
