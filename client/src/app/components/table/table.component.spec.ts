import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TableComponent } from "./table.component";
import { DBData } from "src/app/models/dbData";

describe("TableComponent", () => {
	let component: TableComponent<DBData>;
	let fixture: ComponentFixture<TableComponent<DBData>>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TableComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
