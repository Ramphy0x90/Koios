import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    AfterViewInit,
} from "@angular/core";
import { fromEvent, take } from "rxjs";
import { InspectorStatus } from "src/app/components/inspector/inspector.component";
import { Book } from "src/app/models/book";
import { BookService } from "src/app/services/book.service";
import { InspectorData } from "src/app/models/inspectorData";
import {
    Action,
    ActionEnum,
    UserMode,
} from "src/app/components/table-actions/table-actions.component";
import _ from "lodash";
import * as ExcelJS from 'exceljs';

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


export enum SortOrder {
    ASC = "asc",
    DESC = "desc",
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
    booksOrder = OrderBooks.TITLE;
    booksSortOrder = SortOrder.ASC;

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
        notes1: "",
        notes2: ""
    };

    selectedBooks: Book[] = [];
    inspectedBooks: InspectorData<Book>[] = [];
    draftBookVersion: Book = this.selectedBooks[0];

    constructor(private bookService: BookService) { }

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
        let openInspector = false;

        switch (mode) {
            case UserMode.READ:
                this.cancelOperation();
                break;
            case UserMode.NEW:
                this.selectedBooks = [{ ...this.bookTemplate }];
                openInspector = true;
                break;
            case UserMode.EDIT:
                this.draftBookVersion = { ...this.selectedBooks[0] };
                openInspector = true;
                break;
        }

        this.mode = mode;
        this.inspectedBooks = [...this.formatInspectedBooks()];
        this.status = openInspector ? this.inspectorStatus.OPEN : this.status;
    }

    handleTableAction(action: Action): void {
        switch (action.action) {
            case ActionEnum.CANCEL:
                this.cancelOperation();
                break;
            case ActionEnum.DELETE:
                this.deleteBook();
                break;
            case ActionEnum.EXPORT:
                const filter = action.payload;
                this.export(filter);
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
        this.booksOrder = order;
    }

    sortOrder(sortOrder: SortOrder): void {
        this.booksSortOrder = sortOrder;
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
        this.inspectedBooks = [...this.formatInspectedBooks()];
    }

    formatInspectedBooks(): InspectorData<Book>[] {
        let books: InspectorData<Book>[] = [];

        if (this.mode == UserMode.NEW) {
            books.push({
                type: "Book",
                value: this.bookTemplate,
            });
        } else if (this.mode == UserMode.EDIT) {
            this.selectedBooks.forEach((book) => {
                books.push({
                    type: "Book",
                    value:
                        this.selectedBooks.length == 1
                            ? this.draftBookVersion
                            : book,
                });
            });
        }

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
                .updateBook(this.selectedBooks[0])
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

    saveBook(books: InspectorData<Book>[]): void {
        this.setItemsStatus();
        this.selectedBooks = books.map((book) => book.value);

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

    export(filter: FilterBooks): void {
        const serviceCall = filter == FilterBooks.NONE ?
            this.bookService.getAll() :
            this.bookService.filterBooks(filter);

        serviceCall.pipe(take(1))
            .subscribe((data: Book[]) => {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Doppioni');

                const headers: string[] = ["requestor", "authors", "title", "year", "topic", "place", "notes1", "notes2"];
                const headersIta: string[] = ["Richiedenti", "Autori", "Titolo", "Anno", "Argomento", "Luogo", "Note1", "Note2"];
                const headersToRemove: string[] = ["_id", "createdAt", "updatedAt", "__v", "id", "status"];

                headersToRemove.forEach((header) => {
                    data.forEach((book: any) => {
                        delete book[header];
                    })
                })

                worksheet.addRow(headersIta);
                worksheet.autoFilter = {
                    from: { row: 1, column: 1 },
                    to: { row: 1, column: headers.length },
                };

                data.forEach((book: Book) => {
                    if (book.requestor.length > 0) {
                        book.requestor.forEach((requestor) => {
                            const rowColumns: string[] = [];
                            let tempBook = { ...book }
                            tempBook.requestor = [requestor];

                            _.values(tempBook).forEach((column) => {
                                let columnFormat = _.isArray(column) ? column[0] : column?.toString();
                                rowColumns.push(columnFormat || "");
                            })

                            worksheet.addRow(rowColumns);
                        });
                    } else {
                        let tempBook: any = { ...book };
                        tempBook.requestor = "";
                        worksheet.addRow(_.values(tempBook));
                    }
                });

                workbook.xlsx.writeBuffer().then((buffer: any) => {
                    const blob = new Blob([buffer], { type: 'application/vnd.ms-exce' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');

                    a.href = url;
                    a.download = 'LibriCDE.xlsx';
                    a.click();
                    window.URL.revokeObjectURL(url);
                });
            });
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
