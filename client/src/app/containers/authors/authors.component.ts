import { Component, OnInit } from "@angular/core";
import { InspectorStatus } from "src/app/components/inspector/inspector.component";
import {
	Action,
	UserMode,
} from "src/app/components/table-actions/table-actions.component";
import { Author } from "src/app/models/author";
import { InspectorData } from "src/app/models/inspectorData";

@Component({
	selector: "app-authors",
	templateUrl: "./authors.component.html",
	styleUrls: ["./authors.component.css"],
})
export class AuthorsComponent implements OnInit {
	inspectorStatus = InspectorStatus;
	userMode = UserMode;

	mode = UserMode.READ;
	status = this.inspectorStatus.CLOSED;

	authors: Author[] = [
		{
			_id: "1",
			name: "Ramphy",
			surname: "Aquino Nova",
		},
		{
			_id: "2",
			name: "Cheyenne",
			surname: "Albertelli",
		},
	];
	authorTemplate: Author = {
		name: "",
		surname: "",
	};

	selectedAuthor: Author = this.authorTemplate;
	draftAuthorVersion: Author = this.selectedAuthor;

	constructor() {}

	ngOnInit(): void {}

	setAuthor(author: Author): void {
		this.selectedAuthor = author;
	}

	getAuthor(): InspectorData<Author> {
		let author: InspectorData<Author> = {
			type: "Author",
			value:
				this.mode == this.userMode.EDIT
					? this.draftAuthorVersion
					: this.selectedAuthor,
		};

		return author;
	}

	updateMode(mode: UserMode): void {
		switch (mode) {
			case UserMode.READ:
				break;
			case UserMode.NEW:
				this.selectedAuthor = { ...this.authorTemplate };
				break;
			case UserMode.EDIT:
				this.draftAuthorVersion = { ...this.selectedAuthor };
				this.status = this.inspectorStatus.OPEN;
				break;
		}

		this.mode = mode;
	}

	handleTableAction(action: Action): void {
		// switch (action) {
		// 	case Action.SAVE:
		// 		this.saveBook();
		// 		break;
		// 	case Action.CANCEL:
		// 		this.cancelOperation();
		// 		break;
		// 	case Action.DELETE:
		// 		this.deleteBook();
		// 		break;
		// 	case Action.EXPORT:
		// 		this.export();
		// 		break;
		// }
	}

	fetchAuthors(): void {}

	search(term: string): void {}
}
