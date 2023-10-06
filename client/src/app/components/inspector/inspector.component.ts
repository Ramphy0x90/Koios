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
import { UserMode } from "../table-actions/table-actions.component";
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
export class InspectorComponent<T> implements OnInit, OnChanges {
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

	constructor(private userService: UserService) {
		this.userService.isLogged$.subscribe((status) => {
			this.userLogged = status;
		});
	}

	ngOnInit() {
		this.getScreenWidth = window.innerWidth;
		this.getScreenHeight = window.innerHeight;
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes["mode"]?.currentValue) {
			this.mode = changes["mode"]?.currentValue;
		}

		if (changes["status"]) {
			if (this.status == InspectorStatus.OPEN) {
				this.container && this.openInspector();
			} else {
				this.container && this.closeInspector();
			}
		}

		if (changes["data"]?.currentValue) {
			this.data = changes["data"].currentValue;
		}
	}

	isBook(item: unknown): item is Book {
		return this.data.type == "Book";
	}

	openInspector(): void {
		const containerEl: HTMLElement = this.container.nativeElement;
		containerEl.style.right = "0px";
	}

	closeInspector(): void {
		const containerEl: HTMLElement = this.container.nativeElement;
		const containerWidth = containerEl.offsetWidth;
		containerEl.style.right = `-${containerWidth}px`;

		this.status = InspectorStatus.CLOSED;
		this.closed.emit(true);
	}

	emitSave(): void {
		this.save.emit(true);
		this.closeInspector();
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
}
