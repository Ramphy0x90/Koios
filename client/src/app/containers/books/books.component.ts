import { Component, OnInit, Inject, AfterViewInit } from "@angular/core";
import { take } from "rxjs";
import {
	InspectModel,
	InspectorStatus,
} from "src/app/components/inspector/inspector.component";
import { Book } from "src/app/models/book";
import { BookDto } from "src/app/models/bookDto";
import { BookService } from "src/app/services/book.service";
import * as XLSX from "xlsx";
import { DOCUMENT } from "@angular/common";
import { FormControl, FormGroup } from "@angular/forms";

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
export class BooksComponent implements OnInit, AfterViewInit {
	inspectModel = InspectModel;
	inspectorStatus = InspectorStatus;
	userMode = UserMode;

	mode = UserMode.READ;
	status = this.inspectorStatus.CLOSED;

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
	onSearch: boolean = false;

	searchFormGroup: FormGroup = new FormGroup({
		search: new FormControl(),
	});

	constructor(
		private bookService: BookService,
		@Inject(DOCUMENT) private document: Document
	) {}

	ngOnInit(): void {
		this.fetchBooks();
	}

	ngAfterViewInit(): void {
		this.searchFormGroup
			.get("search")
			?.valueChanges.subscribe((value: string) => {
				const search = value.trim();

				if (search.length >= 2) {
					this.bookService.searchBook(search).subscribe((data) => {
						this.onSearch = true;
						this.books = data;
					});
				} else if (search == "" && this.onSearch == true) {
					this.restoreSearch();
				}
			});
	}

	setMode(mode: UserMode): void {
		switch (mode) {
			case UserMode.NEW:
				this.selectedBook = { ...this.bookTemplate };
				break;
			case UserMode.EDIT:
				this.draftBookVersion = { ...(<Book>this.selectedBook) };
				this.status = this.inspectorStatus.OPEN;
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

	export(): void {
		let elt = this.document.querySelector("app-book-table table");
		let wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
		return XLSX.writeFile(wb, "LibriCDE.xlsx");
	}

	restoreSearch(): void {
		this.onSearch = false;
		this.searchFormGroup.get("search")?.setValue("");
		this.fetchBooks();
	}

	cancelOperation(): void {
		if (this.mode == UserMode.EDIT) {
			this.draftBookVersion = <Book>this.selectedBook;
		} else if (this.mode == UserMode.NEW) {
			this.selectedBook = { ...this.books[0] };
		}

		this.mode = UserMode.READ;
		this.status = this.inspectorStatus.CLOSED;
	}
}
