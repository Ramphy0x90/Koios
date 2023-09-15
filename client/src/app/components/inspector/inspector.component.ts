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

export enum InspectorStatus {
	OPEN,
	CLOSED,
}

@Component({
	selector: "app-inspector",
	templateUrl: "./inspector.component.html",
	styleUrls: ["./inspector.component.css"],
})
export class InspectorComponent implements OnInit, AfterViewInit, OnChanges {
	@ViewChild("inspectorContainer") container!: ElementRef;

	@Input() model?: InspectModel;
	@Input() mode: UserMode = UserMode.READ;
	@Input() status: InspectorStatus = InspectorStatus.CLOSED;
	@Input() data!: Book | BookDto;
	@Output() closed: EventEmitter<boolean> = new EventEmitter();

	inspectModel = InspectModel;
	userMode = UserMode;
	requestorsInputRef: string = "";

	getScreenWidth: number = 0;
	getScreenHeight: number = 0;

	ngOnInit() {
		this.getScreenWidth = window.innerWidth;
		this.getScreenHeight = window.innerHeight;
	}

	ngAfterViewInit(): void {
		this.container && this.closeInspector();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes["data"]?.currentValue) {
			this.data = changes["data"].currentValue;
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
	}

	@HostListener("window:resize", ["$event"])
	onWindowResize() {
		this.getScreenWidth = window.innerWidth;
		this.getScreenHeight = window.innerHeight;

		if (this.canMutate()) {
			this.container && this.closeInspector();
		} else {
			this.container && this.openInspector();
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

	canMutate(): boolean {
		return this.getScreenWidth < 992;
	}

	openInspector(): void {
		const containerEl = this.container.nativeElement;
		containerEl.style.width = "360px";
		containerEl.style.padding = "var(--space-6)";
	}

	closeInspector(): void {
		const containerEl = this.container.nativeElement;
		containerEl.style.width = "0px";
		containerEl.style.padding = "0px";

		this.status = InspectorStatus.CLOSED;
		this.closed.emit(true);
	}
}
