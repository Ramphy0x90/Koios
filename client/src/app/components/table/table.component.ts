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
import { UserMode } from "../table-actions/table-actions.component";

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
	@Input() mode: UserMode = UserMode.READ;

	@Output() updateItem: EventEmitter<T> = new EventEmitter();
	@Output() updateItems: EventEmitter<T[]> = new EventEmitter();

	userModeEnum = UserMode;
	selectedItem: T | undefined = this.data[0];
	selectedItems: T[] = [];
	tableColumns: TableColumn[] = [];

	bookColumns = [
		{ id: "requestor", title: "Richiedenti", width: "medium", auth: true },
		{ id: "authors", title: "Autore", auth: false },
		{
			id: "title",
			title: "Titolo",
			width: "big",
			defaultSort: true,
			auth: false,
		},
		{ id: "year", title: "Anno", width: "small", auth: false },
		{ id: "topic", title: "Argomento", auth: false },
		{ id: "place", title: "Luogo", auth: false },
        { id: "notes1", title: "Note 1", auth: true },
        { id: "notes2", title: "Note 2", auth: true },
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
		if (changes["mode"]?.currentValue == this.userModeEnum.READ) {
			this.selectedItems = [];
		}

		this.setCurrentItemFromUrl();
	}

	isBook(item: unknown): item is Book {
		return _.has(item, "title") || this.router.url.includes("book");
	}

	select(item: T): void {
		const urlParts = this.router.url.split("/");
		const path = urlParts.includes("guest")
			? `guest/${urlParts[urlParts.indexOf("guest") + 1]}/books`
			: "books";

		if (!this.isSelected(item)) {
			if (this.mode == this.userModeEnum.READ) {
				this.selectedItems = [item];
			} else if (this.mode == this.userModeEnum.EDIT) {
				this.selectedItems.push(item);
			}
		} else {
			if (this.selectedItems.length > 1) {
				_.remove(this.selectedItems, (i) => i._id == item._id);
			}
		}

		this.updateItems.emit(this.selectedItems);
		item && this.router.navigate([path, item?._id || ""]);
	}

	isSelected(item: T): boolean {
		return this.selectedItems.includes(item);
	}

	updateData(data: T[]): void {
		this.data = data;
	}

	setCurrentItemFromUrl(): void {
		this.route.params.pipe(take(1)).subscribe((params) => {
			const itemId = params["id"];
			const item = _.find(this.data, (item) => item._id == itemId);

			if (item) {
				this.selectedItems = [item];
				this.updateItems.emit(this.selectedItems);
			}
		});
	}
}
