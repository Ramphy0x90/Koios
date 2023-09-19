import {
	AfterViewInit,
	Component,
	Input,
	Output,
	EventEmitter,
	OnChanges,
	SimpleChanges,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { UserService } from "src/app/services/user.service";

export enum UserMode {
	READ,
	NEW,
	EDIT,
}

export enum Action {
	SAVE,
	CANCEL,
	DELETE,
	EXPORT,
}

@Component({
	selector: "app-table-actions",
	templateUrl: "./table-actions.component.html",
	styleUrls: ["./table-actions.component.css"],
})
export class TableActionsComponent implements OnChanges, AfterViewInit {
	@Input() userMode: UserMode = UserMode.READ;
	@Output() mode: EventEmitter<UserMode> = new EventEmitter();
	@Output() action: EventEmitter<Action> = new EventEmitter();
	@Output() search: EventEmitter<string> = new EventEmitter();
	@Output() restore: EventEmitter<boolean> = new EventEmitter();

	searchFormGroup: FormGroup = new FormGroup({
		search: new FormControl(),
	});

	userModeEnum = UserMode;
	actionEnum = Action;

	currentMode = UserMode.READ;
	onSearch: boolean = false;
	userLogged: boolean = false;

	constructor(private userService: UserService) {
		this.userService.isLogged$.subscribe((status) => {
			this.userLogged = status;
		});
	}

	ngAfterViewInit(): void {
		this.searchFormGroup
			.get("search")
			?.valueChanges.subscribe((value: string) => {
				const term = value.trim();

				if (term.length >= 2) {
					this.onSearch = true;
					this.search.emit(term);
				} else if (term == "" && this.onSearch == true) {
					this.restoreSearch();
				}
			});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes["userMode"]) {
			this.currentMode = changes["userMode"]?.currentValue;
		}
	}

	setMode(mode: UserMode): void {
		this.currentMode = mode;
		this.mode.emit(this.currentMode);
	}

	execAction(action: Action): void {
		this.action.emit(action);
	}

	restoreSearch(): void {
		this.onSearch = false;
		this.searchFormGroup.get("search")?.setValue("");
		this.restore.emit(true);
	}
}
