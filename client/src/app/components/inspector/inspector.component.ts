import { Component, OnInit, Input } from "@angular/core";
import { UserMode } from "src/app/containers/books/books.component";
import { Book } from "src/app/models/book";
import { BookDto } from "src/app/models/bookDto";

export enum InspectModel {
	BOOK,
	AUTHOR,
}

export enum InpectorMode {
	READ,
	NEW,
	EDIT,
}

@Component({
	selector: "app-inspector",
	templateUrl: "./inspector.component.html",
	styleUrls: ["./inspector.component.css"],
})
export class InspectorComponent implements OnInit {
	@Input() model?: InspectModel;
	@Input() mode: UserMode = UserMode.READ;
	@Input() data!: Book | BookDto;

	inspectModel = InspectModel;
	userMode = UserMode;

	constructor() {}

	ngOnInit(): void {}
}
