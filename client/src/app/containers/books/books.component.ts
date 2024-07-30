import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    AfterViewInit,
} from "@angular/core";
import { debounceTime, fromEvent, take, takeUntil } from "rxjs";
import { InspectorStatus } from "src/app/components/inspector/inspector.component";
import { Book } from "src/app/models/book";
import { BookService } from "src/app/services/book.service";
import { InspectorData } from "src/app/models/inspectorData";
import { BookingData, UserMode } from "src/app/components/table-actions/table-actions.component";
import _ from "lodash";
import * as ExcelJS from 'exceljs';
import { Router } from "@angular/router";
import { ViewportScroller } from "@angular/common";

export type PaginationItem = {
    index: number;
    from: number;
    to: number;
}

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
export class BooksComponent implements OnInit {
    @ViewChild("content") contentContainer?: ElementRef;

    readonly BOOKS_INCREMENT: number = 30;
    readonly PAGE_BUFFER: number = 10;

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
    booksCount: number = 0;
    bookTemplate: Book = {
        status: false,
        requestor: [],
        requestorId: [],
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

    paginationItems: PaginationItem[] = [];
    currentPage: number = 0;
    pagesFrom: number = 0;
    pagesTo: number = this.PAGE_BUFFER;

    constructor(
        private bookService: BookService,
        private router: Router,
        private viewportScroller: ViewportScroller
    ) { }

    ngOnInit(): void {
        this.bookService.getAllCount()
            .pipe(take(1))
            .subscribe((booksCount) => {
                this.booksCount = booksCount;

                this.intiPaginationItems();
                this.fetchBooks();
            });
    }

    intiPaginationItems(): void {
        for (let page = 1; page <= Math.ceil(this.booksCount / this.BOOKS_INCREMENT); page++) {
            this.paginationItems.push(
                {
                    index: page,
                    from: (page - 1) * this.BOOKS_INCREMENT,
                    to: this.BOOKS_INCREMENT
                }
            )
        }
    }

    getPaginationItems(): PaginationItem[] {
        return this.paginationItems.slice(this.pagesFrom, this.pagesTo);
    }

    goToPage(pageIndex: number): void {
        const half = Math.floor(this.PAGE_BUFFER / 2);
        this.currentPage = pageIndex;
        this.pagesFrom = this.currentPage - half;
        this.pagesTo = this.currentPage + half;

        if (this.pagesFrom < 0) {
            this.pagesFrom = 0;
            this.pagesTo = Math.min(this.PAGE_BUFFER, this.paginationItems.length);
        } else if (this.pagesTo > this.paginationItems.length) {
            this.pagesTo = this.paginationItems.length;
            this.pagesFrom = Math.max(this.paginationItems.length - this.PAGE_BUFFER + 1, 1);
        }

        this.fetchBooks();
    }

    decPage(): void {
        if (this.currentPage == 0) return;
        this.goToPage(this.currentPage - 1);
    }

    incPage(): void {
        if (this.currentPage == this.paginationItems.length - 1) return;
        this.goToPage(this.currentPage + 1);
    }

    updateMode(mode: UserMode): void {
        let openInspector = false;

        switch (mode) {
            case UserMode.READ:
                this.cancelOperation();
                break;
            case UserMode.NEW:
                this.selectedBooks = [_.cloneDeep(this.bookTemplate)];
                openInspector = true;
                break;
            case UserMode.EDIT:
                this.draftBookVersion = _.cloneDeep(this.selectedBooks[0]);
                openInspector = true;
                break;
        }

        this.mode = mode;
        this.inspectedBooks = [...this.formatInspectedBooks()];
        this.status = openInspector ? this.inspectorStatus.OPEN : this.status;
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
        this.fetchBooks();
    }

    sortOrder(sortOrder: SortOrder): void {
        this.booksSortOrder = sortOrder;
        this.fetchBooks();
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
                        _.cloneDeep(this.selectedBooks.length == 1
                            ? this.draftBookVersion
                            : book),
                });
            });
        }

        return books;
    }

    fetchBooks(): void {
        const page = this.paginationItems[this.currentPage];

        this.isSearching = false;
        this.isFiltering = false;

        this.bookService
            .getAll(page.from, page.to, this.booksSortOrder, this.booksOrder)
            .pipe(take(1))
            .subscribe((data) => {
                this.books = [...data];

                this.selectedBooks =
                    this.books.length > 0
                        ? [this.books[0]]
                        : [this.bookTemplate];

                const item = this.books[0];
                const urlParts = this.router.url.split("/");
                const path = urlParts.includes("guest")
                    ? `guest/${urlParts[urlParts.indexOf("guest") + 1]}/books`
                    : "books";

                if (item) {
                    this.router.navigate([path, this.currentPage, item._id || ""]);
                } else {
                    this.router.navigate([path, this.currentPage, ""]);
                }

                if (this.contentContainer) {
                    this.contentContainer.nativeElement.scrollTop = 0;
                }
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

    booking(requestor: BookingData): void {
        this.draftBookVersion = { ...this.selectedBooks[0] };
        this.draftBookVersion.requestorId.push(requestor.id);
        this.draftBookVersion.requestor.push(requestor.name);
        this.updateBook();
    }

    exportBooking(guest: string): void {
        this.bookService.bookedBooksReport(guest).subscribe((data) => {
            const blob = new Blob([data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url);
        });
    }

    import(books: Book[]): void {
        this.books = [...books];
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
                const headersToRemove: string[] = ["_id", "createdAt", "updatedAt", "__v", "id", "status", "requestorId"];

                headersToRemove.forEach((header) => {
                    data.forEach((book: any) => {
                        delete book[header];
                    })
                });

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
