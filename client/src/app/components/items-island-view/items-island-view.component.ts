import {
	Component,
	Input,
	Output,
	EventEmitter,
	SimpleChanges,
} from "@angular/core";
import { DBData } from "src/app/models/dbData";

@Component({
	selector: "app-items-island-view",
	templateUrl: "./items-island-view.component.html",
	styleUrls: ["./items-island-view.component.css"],
})
export class ItemsIslandViewComponent<T extends DBData> {
	@Input() data: T[] = [];
	@Output() updateItem: EventEmitter<T> = new EventEmitter();

	selectedItem?: T;

	ngOnChanges(changes: SimpleChanges): void {
		if (changes["data"]?.currentValue) {
			this.selectedItem = this.data[0];
			this.updateItem.emit(this.selectedItem);
		}
	}

	select(item: T): void {
		this.selectedItem = item;
		this.updateItem.emit(item);
	}
}
