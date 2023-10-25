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

export enum FilterBooks {
	NONE = "none",
	BOOKS_NO_REQUESTORS = "booksNoRequestors",
	BOOKS_REQUESTORS = "booksRequestor",
	BOOKS_DISABLED = "booksDisabled",
}

export enum OrderBooks {
	TITLE = "title",
	AUTHOR = "authors",
    TOPIC = "topic",
    PLACE = "place",
}

@Component({
	selector: "app-books",
	templateUrl: "./books.component.html",
	styleUrls: ["./books.component.css"],
})
export class BooksComponent implements OnInit, AfterViewInit {
	@ViewChild("content") contentContainer?: ElementRef;

	readonly BOOKS_INCREMENT: number = 20;
	inspectorStatus = InspectorStatus;
	userMode = UserMode;

	mode = UserMode.READ;
	status = this.inspectorStatus.CLOSED;
	islandOrder = OrderBooks.TITLE;

	booksFrom: number = 0;
	booksLimit: number = this.BOOKS_INCREMENT;

	isSearching: boolean = false;
	isFiltering: boolean = false;

	itemsStatus: boolean = true;
	books: Book[] = [];
	bookTemplate: Book = {
		status: false,
		requestor: [],
		authors: "",
		title: "",
		year: new Date().getFullYear(),
		topic: "",
		place: "",
		notes: "",
	};

	selectedBooks: Book[] = [];
	draftBookVersion: Book = this.selectedBooks[0];

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
					!this.isSearching &&
					!this.isFiltering
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
				this.selectedBooks = [{ ...this.bookTemplate }];
				this.status = this.inspectorStatus.OPEN;
				break;
			case UserMode.EDIT:
				this.draftBookVersion = { ...this.selectedBooks[0] };
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

	filter(filter: FilterBooks) {
		if (filter == FilterBooks.NONE) {
			this.fetchBooks();
		} else {
			this.bookService.filterBooks(filter).subscribe((data) => {
				this.isFiltering = true;
				this.books = data;
			});
		}
	}

	order(order: OrderBooks) {
		this.islandOrder = order;
	}

	updateItemsStatus(status: boolean): void {
		this.itemsStatus = status;
	}

	setItemsStatus(): void {
		if (this.selectedBooks.length > 1) {
			this.selectedBooks.forEach((book) => {
				book.status = this.itemsStatus;
			});
		} else {
			this.draftBookVersion.status = this.itemsStatus;
		}
	}

	setBook(book: Book): void {
		this.selectedBooks = [book];
	}

	setBooks(books: Book[]): void {
		this.selectedBooks = [...books];
		this.draftBookVersion = { ...this.selectedBooks[0] };
	}

	getBooks(): InspectorData<Book>[] {
		let books: InspectorData<Book>[] = [];

		this.selectedBooks.forEach((book) => {
			books.push({
				type: "Book",
				value:
					this.selectedBooks.length == 1
						? this.draftBookVersion
						: book,
			});
		});

		return books;
	}

	fetchBooks(append: boolean = false): void {
		this.isSearching = false;
		this.isFiltering = false;

		this.bookService
			.getAll(this.booksFrom, this.booksLimit)
			.pipe(take(1))
			.subscribe((data) => {
				if (append) {
					this.books = [...this.books, ...data];
				} else {
					this.books = data;
				}

				this.selectedBooks =
					this.books.length > 0
						? [this.books[0]]
						: [this.bookTemplate];
			});
	}

	updateBook(): void {
		if (this.selectedBooks.length > 1) {
			for (let book of this.selectedBooks) {
				const bookId = this.draftBookVersion?._id || "";

				this.bookService
					.updateBook(book)
					.pipe(take(1))
					.subscribe((data) => {
						const selectedBookIndex = _.findIndex(
							this.books,
							(book) => book._id == this.selectedBooks[0]._id
						);

						this.books[selectedBookIndex] = data;
						this.books = [...this.books];
						this.mode = UserMode.READ;
					});
			}
		} else {
			this.bookService
				.updateBook(this.draftBookVersion)
				.pipe(take(1))
				.subscribe((data) => {
					const selectedBookIndex = _.findIndex(
						this.books,
						(book) => book._id == this.selectedBooks[0]._id
					);

					this.books[selectedBookIndex] = data;
					this.selectedBooks = [this.books[selectedBookIndex]];
					this.books = [...this.books];
					this.mode = UserMode.READ;
				});
		}
	}

	saveBook(): void {
		this.setItemsStatus();

		if (this.mode == UserMode.NEW) {
			this.bookService
				.createBook(this.selectedBooks[0])
				.pipe(take(1))
				.subscribe((data) => {
					this.mode = UserMode.READ;
					this.selectedBooks = [{ ...data }];
					this.fetchBooks();
				});
		} else if (this.mode == UserMode.EDIT) {
			this.updateBook();
		}
	}

	deleteBook(): void {
		this.selectedBooks.forEach((book) => {
			const bookId = book._id;

			if (bookId) {
				this.bookService
					.deleteBook(bookId)
					.subscribe(() => this.fetchBooks());
			}
		});
	}

	booking(requestor: string): void {
		this.draftBookVersion = { ...this.selectedBooks[0] };
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
			this.draftBookVersion = this.selectedBooks[0];
		} else if (this.mode == UserMode.NEW) {
			this.selectedBooks = [{ ...this.books[0] }];
		}

		this.mode = UserMode.READ;
		this.status = this.inspectorStatus.CLOSED;
	}
}
