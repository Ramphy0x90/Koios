import {
    AfterViewInit,
    Component,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    OnInit,
    ViewChild,
    ElementRef,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { take } from "rxjs";
import {
    FilterBooks,
    OrderBooks,
    SortOrder,
} from "src/app/containers/books/books.component";
import { Book } from "src/app/models/book";
import { BookService } from "src/app/services/book.service";
import { UserService } from "src/app/services/user.service";

export enum UserMode {
    READ,
    NEW,
    EDIT,
    MANAGE,
}

export enum ActionEnum {
    SAVE,
    CANCEL,
    DELETE,
    IMPORT,
    EXPORT,
}

export interface Action {
    action: ActionEnum,
    payload?: any
}

export interface BookingData {
    id: string,
    name: string
}

@Component({
    selector: "app-table-actions",
    templateUrl: "./table-actions.component.html",
    styleUrls: ["./table-actions.component.css"],
})
export class TableActionsComponent implements OnInit, OnChanges, AfterViewInit {
    @ViewChild('fileInput') fileInput?: ElementRef;

    @Input() userMode: UserMode = UserMode.READ;

    @Output() mode: EventEmitter<UserMode> = new EventEmitter();
    @Output() search: EventEmitter<string> = new EventEmitter();
    @Output() restore: EventEmitter<boolean> = new EventEmitter();
    @Output() booking: EventEmitter<BookingData> = new EventEmitter();
    @Output() filterBy: EventEmitter<FilterBooks> = new EventEmitter();
    @Output() orderBy: EventEmitter<OrderBooks> = new EventEmitter();
    @Output() sortOrder: EventEmitter<SortOrder> = new EventEmitter();
    @Output() importBooks: EventEmitter<Book[]> = new EventEmitter();
    @Output() exportBooking: EventEmitter<string> = new EventEmitter();
    @Output() exportBooks: EventEmitter<FilterBooks> = new EventEmitter();

    searchFormGroup: FormGroup = new FormGroup({
        search: new FormControl(),
    });

    filterBooksEnum = FilterBooks;
    orderBooksEnum = OrderBooks;
    sortOrderEnum = SortOrder;
    userModeEnum = UserMode;
    actionEnum = ActionEnum;

    currentMode = UserMode.READ;
    currentFilter = FilterBooks.NONE;
    currentOrder = OrderBooks.TITLE;
    currentSortOrder = SortOrder.ASC;

    onSearch: boolean = false;
    userLogged: boolean = false;
    appendToExisting: number = 0;

    selectedBookId?: string;
    selectedBook?: Book;
    selectedFile?: File;
    possibleRequestor: string = "";
    pdfForRequestor: string = "";
    exportFilter = FilterBooks.NONE;

    constructor(
        private userService: UserService,
        private bookService: BookService,
        private route: ActivatedRoute,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.userService.isLogged$.subscribe((status) => {
            this.userLogged = status;
        });

        this.route.params.subscribe((params) => {
            this.selectedBookId = params["id"];
            this.fetchCurrentBook();
        });
    }

    ngAfterViewInit(): void {
        this.searchFormGroup
            .get("search")
            ?.valueChanges.subscribe((value: string) => {
                const term = value.trim();

                if (term.length >= 2) {
                    this.onSearch = true;
                    this.search.emit(term);
                } else if (term == "" && this.onSearch == true) {
                    this.restoreSearch();
                }
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["userMode"]) {
            this.currentMode = changes["userMode"]?.currentValue;
        }
    }

    setMode(mode: UserMode): void {
        this.currentMode = mode;
        this.mode.emit(this.currentMode);
    }

    setFilterBy(filter: FilterBooks): void {
        this.filterBy.emit(filter);
    }

    setOrderBy(order: OrderBooks): void {
        this.orderBy.emit(order);
    }

    setSortOrder(sortOrder: SortOrder): void {
        this.sortOrder.emit(sortOrder);
    }

    export(filters: FilterBooks): void {
        this.exportBooks.emit(filters);
    }

    restoreSearch(): void {
        this.onSearch = false;
        this.searchFormGroup.get("search")?.setValue("");
        this.restore.emit(true);
    }

    fetchCurrentBook(): void {
        if (this.selectedBookId) {
            this.bookService
                .getBookById(this.selectedBookId)
                .pipe(take(1))
                .subscribe((book) => {
                    this.selectedBook = book;
                });
        }
    }

    bookBooking(): void {
        if (this.possibleRequestor.length == 0) {
            this.toastr.warning("Il campo richiedente non può essere vuoto");
        } else {
            this.route.params.pipe(take(1)).subscribe((params) => {
                const guestId = params["guest"];
                this.booking.emit({ id: guestId, name: this.possibleRequestor });
                this.possibleRequestor = "";

                this.toastr.success(`Il libro "${this.selectedBook?.title}" è stato prenotato con successo!`);
            });
        }
    }

    exportBookings(): void {
        if (!this.pdfForRequestor) {
            this.toastr.warning("Il campo cognome, nome non può essere vuoto");
        } else {
            this.exportBooking.emit(this.pdfForRequestor);
            this.pdfForRequestor = "";
        }
    }

    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
    }

    uploadFile() {
        if (this.selectedFile) {
            this.bookService.uploadExcelFile(this.selectedFile, !!(Number(this.appendToExisting))).subscribe({
                next: (response) => {
                    this.selectedFile = undefined;

                    if (this.fileInput) {
                        this.fileInput.nativeElement.value = '';
                    }

                    this.importBooks.emit(response);
                    this.toastr.success("File Excel importato correttamente");
                },
                error: (error) => {
                    this.toastr.error("Errore durante il caricamento del file Excel");
                }
            });
        }
    }
}
