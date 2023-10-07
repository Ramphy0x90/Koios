import { ComponentFixture, TestBed } from "@angular/core/testing";

import { InspectorComponent } from "./inspector.component";

describe("InspectorComponent", () => {
	let component: InspectorComponent<unknown>;
	let fixture: ComponentFixture<InspectorComponent<unknown>>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [InspectorComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(InspectorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
