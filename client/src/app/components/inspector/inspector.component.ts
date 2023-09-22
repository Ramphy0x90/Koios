import {
	Component,
	Input,
	OnChanges,
	SimpleChanges,
	ViewChild,
	ElementRef,
	HostListener,
	OnInit,
	Output,
	EventEmitter,
	AfterViewInit,
} from "@angular/core";
import { Book } from "src/app/models/book";
import _ from "lodash";
import { InspectorData } from "src/app/models/inspectorData";
import { Author } from "src/app/models/author";
import { UserMode } from "../table-actions/table-actions.component";
import { AuthorService } from "src/app/services/author.service";
import { UserService } from "src/app/services/user.service";

export enum InpectorMode {
	READ,
	NEW,
	EDIT,
}

export enum InspectorStatus {
	OPEN,
	CLOSED,
}

@Component({
	selector: "app-inspector",
	templateUrl: "./inspector.component.html",
	styleUrls: ["./inspector.component.css"],
})
export class InspectorComponent<T> implements OnInit, AfterViewInit, OnChanges {
	@ViewChild("inspectorContainer") container!: ElementRef;

	@Input() mode: UserMode = UserMode.READ;
	@Input() status: InspectorStatus = InspectorStatus.CLOSED;
	@Input() data!: InspectorData<T>;

	@Output() save: EventEmitter<boolean> = new EventEmitter();
	@Output() closed: EventEmitter<boolean> = new EventEmitter();

	userMode = UserMode;
	requestorsInputRef: string = "";

	getScreenWidth: number = 0;
	getScreenHeight: number = 0;

	userLogged: boolean = false;
	authors: Author[] = [];

	constructor(
		private userService: UserService,
		private authorService: AuthorService
	) {
		this.userService.isLogged$.subscribe((status) => {
			this.userLogged = status;
		});
	}

	ngOnInit() {
		this.getScreenWidth = window.innerWidth;
		this.getScreenHeight = window.innerHeight;

		if (this.isBook(this.data.value)) {
			this.getAuthors();
		}
	}

	ngAfterViewInit(): void {
		this.updateInspectorView();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes["mode"]?.currentValue) {
			this.mode = changes["mode"]?.currentValue;
		}

		if (changes["status"]) {
			if (this.canMutate()) {
				if (this.status == InspectorStatus.OPEN) {
					this.container && this.openInspector();
				} else {
					this.container && this.closeInspector();
				}
			}
		}

		if (changes["data"]?.currentValue) {
			this.data = changes["data"].currentValue;
		}
	}

	isBook(item: unknown): item is Book {
		return this.data.type == "Book";
	}

	isAuthor(item: unknown): item is Author {
		return this.data.type == "Author";
	}

	@HostListener("window:resize", ["$event"])
	onWindowResize() {
		this.getScreenWidth = window.innerWidth;
		this.getScreenHeight = window.innerHeight;
		this.updateInspectorView();
	}

	updateInspectorView(): void {
		if (this.canMutate()) {
			this.container && this.closeInspector();
		} else {
			this.container && this.openInspector();
		}
	}

	canMutate(): boolean {
		return this.getScreenWidth < 992;
	}

	openInspector(): void {
		const containerEl = this.container.nativeElement;
		containerEl.style.width = "360px";
		containerEl.style.padding = "var(--space-6)";
	}

	emitSave(): void {
		this.save.emit(true);
		this.closeInspector();
	}

	closeInspector(): void {
		const containerEl = this.container.nativeElement;
		containerEl.style.width = "0px";
		containerEl.style.padding = "0px";

		this.status = InspectorStatus.CLOSED;
		this.closed.emit(true);
	}

	insertRequestor(): void {
		if (this.isBook(this.data.value)) {
			this.data.value.requestor.push(this.requestorsInputRef);
			this.requestorsInputRef = "";
		}
	}

	deleteRequestor(name: string): void {
		if (this.isBook(this.data.value)) {
			_.remove(this.data.value.requestor, (requestor) => {
				return requestor == name;
			});
		}
	}

	getAuthors(): void {
		this.authorService.getAll().subscribe((data) => {
			this.authors = data;
		});
	}
}
