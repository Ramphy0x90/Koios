import {
	AfterViewInit,
	Directive,
	ElementRef,
	Renderer2,
	Input,
	Output,
	EventEmitter,
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
export class SortDirective implements AfterViewInit {
	@Input() data: any[] = [];
	@Output() updateData = new EventEmitter();

	private readonly icons = {
		[Order.NONE]: "bi bi-arrow-down-up sort-icon",
		[Order.ASCENDING]: "bi bi-sort-up-alt sort-icon",
		[Order.DESCENDING]: "bi bi-sort-down sort-icon",
	};

	tableColumns: HTMLElement[] = [];
	currentSortingByColumn: string = "";
	currentSortingIcon?: HTMLElement;
	currentSortingOrder: Order = Order.NONE;

	constructor(private element: ElementRef, private renderer: Renderer2) {}

	ngAfterViewInit(): void {
		this.initEventListeners();
	}

	initEventListeners(): void {
		this.tableColumns = this.element.nativeElement.querySelectorAll("th");

		this.tableColumns.forEach((column: HTMLElement) => {
			fromEvent(column, "click").subscribe(() => {
				this.updateSortOrder(!this.isSortingByCurrentColumn(column));

				this.currentSortingByColumn = column.id || "";
				this.removeCurrentSortingColumnIcon();
				this.updateSortingIcon();
				this.sortData();
			});

			fromEvent(column, "mouseenter").subscribe(() => {
				this.addSortingIcon(column);
			});

			fromEvent(column, "mouseout").subscribe(() => {
				this.removeSortingIcon(column);
			});
		});
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

	addSortingIcon(column: HTMLElement): void {
		if (!this.isSortingByCurrentColumn(column)) {
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

	removeSortingIcon(column: HTMLElement): void {
		if (this.currentSortingIcon) {
			if (
				!this.isSortingByCurrentColumn(column) ||
				this.currentSortingOrder == Order.NONE
			) {
				this.renderer.removeChild(column, this.currentSortingIcon);
				this.currentSortingIcon = undefined;
			}

			if (this.currentSortingOrder == Order.NONE) {
				this.currentSortingByColumn = "";
			}
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
