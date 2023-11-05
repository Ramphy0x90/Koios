import {
	Component,
	Input,
	Output,
	EventEmitter,
	SimpleChanges,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DBData } from "src/app/models/dbData";
import { take } from "rxjs";
import _ from "lodash";
import { OrderBooks, SortOrder } from "src/app/containers/books/books.component";

@Component({
	selector: "app-items-island-view",
	templateUrl: "./items-island-view.component.html",
	styleUrls: ["./items-island-view.component.css"],
})
export class ItemsIslandViewComponent<T extends DBData> {
	@Input() data: T[] = [];
    @Input() order: OrderBooks = OrderBooks.TITLE;
    @Input() sortOrder: SortOrder = SortOrder.ASC;
	@Output() updateItem: EventEmitter<T> = new EventEmitter();

	selectedItem?: T;

	constructor(private route: ActivatedRoute, private router: Router) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes["data"]?.currentValue) {
			this.setCurrentItemFromUrl();
			this.orderItems();
		}

		if (changes["order"]?.currentValue || changes["sortOrder"]?.currentValue) {
			this.orderItems();
        }
	}

	select(item: T): void {
		const urlParts = this.router.url.split("/");
		const path = urlParts.includes("guest")
			? `guest/${urlParts[urlParts.indexOf("guest") + 1]}/books`
			: "books";

		this.selectedItem = item;
		item && this.router.navigate([path, item?._id]);
		this.updateItem.emit(item);
	}

	orderItems(): void {
		this.data = _.orderBy(this.data, this.order, this.sortOrder);
		this.data = [...this.data];
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
