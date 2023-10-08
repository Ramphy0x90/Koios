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
import { UserService } from "src/app/services/user.service";

interface TableColumn {
	id: string;
	title: string;
	defaultSort?: boolean;
	width?: string;
	auth: boolean;
}

@Component({
	selector: "app-table",
	templateUrl: "./table.component.html",
	styleUrls: ["./table.component.css"],
})
export class TableComponent<T extends DBData> implements OnInit, OnChanges {
	@Input() data: T[] = [];
	@Output() updateItem: EventEmitter<T> = new EventEmitter();

	selectedItem: T = this.data[0];
	tableColumns: TableColumn[] = [];

	bookColumns = [
		{ id: "requestor", title: "Richiedenti", auth: false },
		{ id: "authors", title: "Autore", auth: false },
		{ id: "title", title: "Titolo", defaultSort: true, auth: false },
		{ id: "year", title: "Anno", width: "100px", auth: false },
		{ id: "topic", title: "Argomento", auth: false },
		{ id: "place", title: "Luogo", auth: false },
		{ id: "notes", title: "Note", auth: true },
	];

	userLogged: boolean = false;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private userService: UserService
	) {}

	ngOnInit(): void {
		this.userService.isLogged$.subscribe((status) => {
			this.userLogged = status;
		});

		if (this.isBook(this.data[0])) {
			this.tableColumns = this.bookColumns;
		}

		this.setCurrentItemFromUrl();
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.setCurrentItemFromUrl();
	}

	isBook(item: unknown): item is Book {
		return _.has(item, "title") || this.router.url.includes("book");
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
