import { Component, Input } from "@angular/core";
import { Book } from "src/app/models/book";
import _ from "lodash";

@Component({
	selector: "app-island-item",
	templateUrl: "./island-item.component.html",
	styleUrls: ["./island-item.component.css"],
})
export class IslandItemComponent<T> {
	@Input() item?: T;
	@Input() active: boolean = false;

	isBook(item: unknown): item is Book {
		return _.has(item, "title");
	}
}
