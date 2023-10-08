import {
	AfterViewInit,
	Directive,
	ElementRef,
	Renderer2,
	Input,
	Output,
	EventEmitter,
	OnChanges,
	SimpleChanges,
} from "@angular/core";
import { fromEvent } from "rxjs";
import _ from "lodash";

enum Order {
	NONE = "none",
	ASCENDING = "asc",
	DESCENDING = "desc",
}

@Directive({
	selector: "[sort]",
})
export class SortDirective<T> implements AfterViewInit, OnChanges {
	@Input() data: T[] = [];
	@Output() updateData = new EventEmitter();

	private readonly icons = {
		[Order.NONE]: "bi bi-arrow-down-up sort-icon",
		[Order.ASCENDING]: "bi bi-sort-up-alt sort-icon",
		[Order.DESCENDING]: "bi bi-sort-down sort-icon",
	};

	tableColumns: HTMLElement[] = [];
	currentSortingByColumn: string = "";
	currentSortingIcon?: HTMLElement;
	currentSortingOrder: Order = Order.ASCENDING;
	tempHoverIcon?: HTMLElement;

	defaultSortColumn?: HTMLElement;

	constructor(private element: ElementRef, private renderer: Renderer2) {}

	ngAfterViewInit(): void {
		this.initEventListeners();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (this.defaultSortColumn) {
			this.initSort(this.defaultSortColumn, true);
		}
	}

	initEventListeners(): void {
		this.tableColumns = this.element.nativeElement.querySelectorAll("th");

		this.tableColumns.forEach((column: HTMLElement) => {
			if (column.classList.contains("default-sort")) {
				this.currentSortingByColumn = column.id;
				this.defaultSortColumn = column;
			}

			column.style.position = "relative";

			fromEvent(column, "click").subscribe(() => {
				this.initSort(column);
			});

			fromEvent(column, "mouseenter").subscribe(() => {
				this.addSortingIcon(column, true);
			});

			fromEvent(column, "mouseout").subscribe(() => {
				this.removeSortingIcon(column, true);
			});
		});
	}

	initSort(column: HTMLElement, initDefault: boolean = false): void {
		if (initDefault) {
			this.addSortingIcon(column);
		} else {
			const initial = !this.isSortingByCurrentColumn(column);

			this.removeSortingIcon(column);
			this.currentSortingByColumn = column.id;

			this.addSortingIcon(column);
			this.updateSortOrder(initial);
			this.updateSortingIcon();

			// Order is none, set sort icon with temporary
			if (
				this.currentSortingIcon &&
				this.currentSortingOrder == Order.NONE
			) {
				this.removeSortingIcon(column);
				this.addSortingIcon(column, true);
			}
		}

		this.sortData();
	}

	sortData(): void {
		const order =
			this.currentSortingOrder == Order.NONE
				? Order.DESCENDING
				: this.currentSortingOrder;

		this.data = _.orderBy(this.data, this.currentSortingByColumn, order);
		this.updateData.emit(this.data);
	}

	updateSortOrder(initial: boolean): void {
		const max: number = _.values(Order).length - 1;
		let sortingOrderIndex = _.values(Order).indexOf(
			this.currentSortingOrder
		);

		sortingOrderIndex += sortingOrderIndex == max ? -max : 1;
		sortingOrderIndex = initial ? 1 : sortingOrderIndex;

		this.currentSortingOrder = _.values(Order)[sortingOrderIndex];
	}

	isSortingByCurrentColumn(column: HTMLElement): boolean {
		return this.currentSortingByColumn == column.id;
	}

	addSortingIcon(column: HTMLElement, temp: boolean = false): void {
		// Icon temp hover
		if (!this.isSortingByCurrentColumn(column) && temp) {
			this.tempHoverIcon = this.renderer.createElement("i");

			if (this.tempHoverIcon) {
				this.tempHoverIcon.className = this.icons[Order.NONE];
				this.renderer.appendChild(column, this.tempHoverIcon);
			}
		}
		// First time icon add
		else if (!this.currentSortingIcon) {
			this.removeSortingIcon(column, true);
			this.currentSortingIcon = this.renderer.createElement("i");

			if (this.currentSortingIcon) {
				this.currentSortingIcon.className =
					this.icons[this.currentSortingOrder];
				this.renderer.appendChild(column, this.currentSortingIcon);
			}
		}
	}

	updateSortingIcon(): void {
		if (this.currentSortingIcon) {
			this.currentSortingIcon.className =
				this.icons[this.currentSortingOrder];
		}
	}

	removeSortingIcon(column: HTMLElement, temp: boolean = false): void {
		if (temp) {
			if (this.tempHoverIcon) {
				this.renderer.removeChild(column, this.tempHoverIcon);
				this.tempHoverIcon = undefined;
			}
		} else if (this.currentSortingIcon) {
			this.renderer.removeChild(column, this.currentSortingIcon);
			this.currentSortingIcon = undefined;
			this.currentSortingByColumn = "";
		}
	}

	removeCurrentSortingColumnIcon(): void {
		this.tableColumns.forEach((column: HTMLElement) => {
			let sortIcon = column?.querySelector(".sort-icon");

			if (sortIcon && !this.isSortingByCurrentColumn(column)) {
				this.renderer.removeChild(column, sortIcon);
			}
		});
	}
}
