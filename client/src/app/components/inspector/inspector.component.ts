import { Component, OnInit, Input } from "@angular/core";
import { Book } from "src/app/models/book";

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
	@Input() data: Book = {
		requestor: "",
		author: "",
		title: "",
		year: 0,
		topic: "",
		place: "",
		notes_1: "",
		notes_2: "",
	};

	inspectModel = InspectModel;
	inpectorMode = InpectorMode;
	mode: InpectorMode = InpectorMode.READ;

	constructor() {}

	ngOnInit(): void {}

	setMode(mode: InpectorMode): void {
		this.mode = mode;
	}
}
