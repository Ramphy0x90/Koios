import { Component, OnInit, Inject } from "@angular/core";
import { take } from "rxjs";
import { InspectorStatus } from "src/app/components/inspector/inspector.component";
import {
	Action,
	UserMode,
} from "src/app/components/table-actions/table-actions.component";
import { Author } from "src/app/models/author";
import { InspectorData } from "src/app/models/inspectorData";
import { AuthorService } from "src/app/services/author.service";
import { DOCUMENT } from "@angular/common";
import * as XLSX from "xlsx";

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

	authors: Author[] = [];
	authorTemplate: Author = {
		name: "",
		surname: "",
	};

	selectedAuthor: Author = this.authorTemplate;
	draftAuthorVersion: Author = this.selectedAuthor;

	constructor(
		private authorService: AuthorService,
		@Inject(DOCUMENT) private document: Document
	) {}

	ngOnInit(): void {
		this.fetchAuthors();
	}

	updateMode(mode: UserMode): void {
		switch (mode) {
			case UserMode.READ:
				this.cancelOperation();
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
		switch (action) {
			case Action.SAVE:
				this.saveAuthor();
				break;
			case Action.CANCEL:
				this.cancelOperation();
				break;
			case Action.DELETE:
				this.deleteAuthor();
				break;
			case Action.EXPORT:
				this.export();
				break;
		}
	}

	search(term: string): void {
		this.authorService.searchAuthor(term).subscribe((data) => {
			this.authors = data;
		});
	}

	setAuthor(author: Author): void {
		this.selectedAuthor = author || this.authorTemplate;
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

	fetchAuthors(): void {
		this.authorService
			.getAll()
			.pipe(take(1))
			.subscribe((data) => {
				this.authors = data;
				this.selectedAuthor =
					this.authors.length > 0
						? this.authors[0]
						: this.authorTemplate;
			});
	}

	updateAuthor(): void {
		const bookId = this.draftAuthorVersion?._id || "";

		this.authorService
			.updateAuthor(bookId, this.draftAuthorVersion)
			.pipe(take(1))
			.subscribe((data) => {
				this.fetchAuthors();
				this.selectedAuthor = data;
				this.mode = UserMode.READ;
			});
	}

	saveAuthor(): void {
		if (this.mode == UserMode.NEW) {
			this.authorService
				.createAuthor(this.selectedAuthor)
				.pipe(take(1))
				.subscribe((data) => {
					this.mode = UserMode.READ;
					this.selectedAuthor = { ...data };
					this.fetchAuthors();
				});
		} else if (this.mode == UserMode.EDIT) {
			this.updateAuthor();
		}
	}

	deleteAuthor(): void {
		const bookId = this.selectedAuthor?._id || "";

		this.authorService.deleteAuthor(bookId);
		this.fetchAuthors();
	}

	export(): void {
		let elt = this.document.querySelector("app-book-table table");
		let wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
		return XLSX.writeFile(wb, "AutoriLibriCDE.xlsx");
	}

	cancelOperation(): void {
		if (this.mode == UserMode.EDIT) {
			this.draftAuthorVersion = this.selectedAuthor;
		} else if (this.mode == UserMode.NEW) {
			this.selectedAuthor = { ...this.authors[0] };
		}

		this.mode = UserMode.READ;
		this.status = this.inspectorStatus.CLOSED;
	}
}
