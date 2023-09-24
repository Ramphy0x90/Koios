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

@Component({
	selector: "app-items-island-view",
	templateUrl: "./items-island-view.component.html",
	styleUrls: ["./items-island-view.component.css"],
})
export class ItemsIslandViewComponent<T extends DBData> {
	@Input() data: T[] = [];
	@Output() updateItem: EventEmitter<T> = new EventEmitter();

	selectedItem?: T;

	constructor(private route: ActivatedRoute, private router: Router) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes["data"]?.currentValue) {
			this.setCurrentItemFromUrl();
		}
	}

	select(item: T): void {
		this.selectedItem = item;
		item && this.router.navigate(["books", item?._id]);
		this.updateItem.emit(item);
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
