import {
	Component,
	OnInit,
	Input,
	OnChanges,
	SimpleChanges,
} from "@angular/core";
import { UserMode } from "src/app/containers/books/books.component";
import { Book } from "src/app/models/book";
import { BookDto } from "src/app/models/bookDto";
import _ from "lodash";

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
export class InspectorComponent implements OnChanges {
	@Input() model?: InspectModel;
	@Input() mode: UserMode = UserMode.READ;
	@Input() data!: Book | BookDto;

	inspectModel = InspectModel;
	userMode = UserMode;
	requestorsInputRef: string = "";

	constructor() {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes["data"]?.currentValue) {
			this.data = changes["data"].currentValue;
		}
	}

	insertRequestor(): void {
		this.data.requestor.push(this.requestorsInputRef);
		this.requestorsInputRef = "";
	}

	deleteRequestor(name: string): void {
		_.remove(this.data.requestor, (requestor) => {
			return requestor == name;
		});
	}
}
