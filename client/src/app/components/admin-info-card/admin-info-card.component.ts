import { Component, Input } from "@angular/core";

@Component({
	selector: "app-admin-info-card",
	templateUrl: "./admin-info-card.component.html",
	styleUrls: ["./admin-info-card.component.css"],
})
export class AdminInfoCardComponent {
	@Input() icon: string = "";
	@Input() title: string = "";
	@Input() value: number = 0;
}
