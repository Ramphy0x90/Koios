import {
	Component,
	Input,
	Output,
	EventEmitter,
	OnChanges,
	SimpleChanges,
	OnInit,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { take } from "rxjs";
import _ from "lodash";
import { DBData } from "src/app/models/dbData";
import { Book } from "src/app/models/book";
import { Author } from "src/app/models/author";

@Component({
	selector: "app-table",
	templateUrl: "./table.component.html",
	styleUrls: ["./table.component.css"],
})
export class TableComponent<T extends DBData> implements OnChanges {
	@Input() data: T[] = [];
	@Output() updateItem: EventEmitter<T> = new EventEmitter();

	constructor(private route: ActivatedRoute, private router: Router) {}

	selectedItem: T = this.data[0];

	tableColumns: { id: string; title: string }[] = [];

	bookColumns = [
		{ id: "requestor", title: "Richiedenti" },
		{ id: "author", title: "Autore" },
		{ id: "title", title: "Titolo" },
		{ id: "year", title: "Anno" },
		{ id: "topic", title: "Argomento" },
		{ id: "place", title: "Luogo" },
		{ id: "notes", title: "Note" },
	];

	authorColumns = [
		{ id: "name", title: "Nome" },
		{ id: "surname", title: "Cognome" },
		{ id: "books", title: "# Libri" },
	];

	ngOnChanges(changes: SimpleChanges): void {
		if (changes["data"]?.currentValue) {
			this.tableColumns = this.isBook(this.data[0])
				? this.bookColumns
				: this.authorColumns;
			this.setCurrentBookFromUrl();
		}
	}

	isBook(item: unknown): item is Book {
		return _.has(item, "title");
	}

	isAuthor(item: unknown): item is Author {
		return _.has(item, "name");
	}

	select(item: T): void {
		const path = this.isBook(this.data[0]) ? "books" : "authors";

		this.selectedItem = item;
		item && this.router.navigate([path, item?._id]);
		this.updateItem.emit(item);
	}

	updateData(data: T[]): void {
		this.data = data;
	}

	setCurrentBookFromUrl(): void {
		this.route.params.pipe(take(1)).subscribe((params) => {
			const itemId = params["id"];
			const item = _.find(this.data, (item) => item._id == itemId);

			if (item) {
				this.selectedItem = item;
				this.updateItem.emit(item);
			} else {
				this.select(this.data[0]);
			}
		});
	}
}
