import {
	Component,
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
	tableColumns = [
		{ id: "requestor", title: "Richiedenti" },
		{ id: "author", title: "Autore" },
		{ id: "title", title: "Titolo" },
		{ id: "year", title: "Anno" },
		{ id: "topic", title: "Argomento" },
		{ id: "place", title: "Luogo" },
		{ id: "notes", title: "Note" },
	];

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

	updateData(data: Book[]): void {
		this.data = data;
	}
}
