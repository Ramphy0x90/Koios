import {
	Component,
	Input,
	Output,
	EventEmitter,
	SimpleChanges,
} from "@angular/core";
import { Author } from "src/app/models/author";

@Component({
	selector: "app-author-table",
	templateUrl: "./author-table.component.html",
	styleUrls: ["./author-table.component.css"],
})
export class AuthorTableComponent {
	@Input() data: Author[] = [];
	@Output() updateAuthor: EventEmitter<Author> = new EventEmitter();

	selectedAuthor: Author = this.data[0];
	tableColumns = [
		{ id: "name", title: "Nome" },
		{ id: "surname", title: "Cognome" },
		{ id: "books", title: "# Libri" },
	];

	constructor() {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes["data"]?.currentValue) {
			this.selectedAuthor = this.data[0];
			this.updateAuthor.emit(this.selectedAuthor);
		}
	}

	select(author: Author): void {
		this.selectedAuthor = author;
		this.updateAuthor.emit(author);
	}

	updateData(data: Author[]): void {
		this.data = data;
	}
}
