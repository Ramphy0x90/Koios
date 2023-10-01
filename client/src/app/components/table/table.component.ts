import {
	Component,
	Input,
	Output,
	EventEmitter,
	OnInit,
	OnChanges,
	SimpleChanges,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { take } from "rxjs";
import _ from "lodash";
import { DBData } from "src/app/models/dbData";
import { Book } from "src/app/models/book";
import { Author } from "src/app/models/author";

interface TableColumn {
	id: string;
	title: string;
	defaultSort?: boolean;
}

@Component({
	selector: "app-table",
	templateUrl: "./table.component.html",
	styleUrls: ["./table.component.css"],
})
export class TableComponent<T extends DBData> implements OnInit, OnChanges {
	@Input() data: T[] = [];
	@Output() updateItem: EventEmitter<T> = new EventEmitter();

	constructor(private route: ActivatedRoute, private router: Router) {}

	selectedItem: T = this.data[0];
	tableColumns: TableColumn[] = [];

	bookColumns = [
		{ id: "requestor", title: "Richiedenti" },
		{ id: "author", title: "Autore" },
		{ id: "title", title: "Titolo", defaultSort: true },
		{ id: "year", title: "Anno" },
		{ id: "topic", title: "Argomento" },
		{ id: "place", title: "Luogo" },
		{ id: "notes", title: "Note" },
	];

	authorColumns = [
		{ id: "name", title: "Nome", defaultSort: true },
		{ id: "surname", title: "Cognome" },
		{ id: "books", title: "# Libri" },
	];

	ngOnInit(): void {
		if (this.isBook(this.data[0])) {
			this.tableColumns = this.bookColumns;
		} else if (this.isAuthor(this.data[0])) {
			this.tableColumns = this.authorColumns;
		}

		this.setCurrentItemFromUrl();
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.setCurrentItemFromUrl();
	}

	isBook(item: unknown): item is Book {
		return _.has(item, "title") || this.router.url.includes("book");
	}

	isAuthor(item: unknown): item is Author {
		return _.has(item, "name") || this.router.url.includes("author");
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

	setCurrentItemFromUrl(): void {
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
