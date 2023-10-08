import {
	Component,
	OnInit,
	Inject,
	ViewChild,
	ElementRef,
	AfterViewInit,
} from "@angular/core";
import { fromEvent, take } from "rxjs";
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
import _ from "lodash";

@Component({
	selector: "app-books",
	templateUrl: "./books.component.html",
	styleUrls: ["./books.component.css"],
})
export class BooksComponent implements OnInit, AfterViewInit {
	@ViewChild("content") contentContainer?: ElementRef;

	inspectorStatus = InspectorStatus;
	userMode = UserMode;

	mode = UserMode.READ;
	status = this.inspectorStatus.CLOSED;

	BOOKS_INCREMENT: number = 20;
	booksFrom: number = 0;
	booksLimit: number = this.BOOKS_INCREMENT;
	isSearching: boolean = false;

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

	ngAfterViewInit(): void {
		this.contentContainerScroll();
	}

	contentContainerScroll(): void {
		const contentContainerEl = this.contentContainer?.nativeElement;
		fromEvent(contentContainerEl, "scroll", { capture: true }).subscribe(
			() => {
				const scrolled =
					contentContainerEl.offsetHeight +
					contentContainerEl.scrollTop;

				if (
					scrolled >= contentContainerEl.scrollHeight &&
					!this.isSearching
				) {
					this.booksFrom += this.BOOKS_INCREMENT;
					this.fetchBooks(true);
				}
			}
		);
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
			this.isSearching = true;
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

	fetchBooks(append: boolean = false): void {
		this.isSearching = false;
		this.bookService
			.getAll(this.booksFrom, this.booksLimit)
			.pipe(take(1))
			.subscribe((data) => {
				if (append) {
					this.books = [...this.books, ...data];
				} else {
					this.books = data;
				}

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
				const selectedBookIndex = _.findIndex(
					this.books,
					(book) => book._id == this.selectedBook._id
				);

				this.books[selectedBookIndex] = data;
				this.selectedBook = this.books[selectedBookIndex];
				this.books = [...this.books];
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

	booking(requestor: string): void {
		this.draftBookVersion = { ...this.selectedBook };
		this.draftBookVersion.requestor.push(requestor);
		this.updateBook();
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
