import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	OnChanges,
	SimpleChanges,
} from "@angular/core";
import { Book } from "src/app/models/book";

@Component({
	selector: "app-book-table",
	templateUrl: "./book-table.component.html",
	styleUrls: ["./book-table.component.css"],
})
export class BookTableComponent implements OnChanges {
	@Input() data: Book[] = [];
	@Output() updateBook: EventEmitter<Book> = new EventEmitter();

	selectedBook: Book = this.data[0];

	constructor() {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes["data"]?.currentValue) {
			this.selectedBook = this.data[0];
			this.updateBook.emit(this.selectedBook);
		}
	}

	select(book: Book): void {
		this.selectedBook = book;
		this.updateBook.emit(book);
	}
}
