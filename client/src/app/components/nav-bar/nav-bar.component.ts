import { Component, OnInit } from "@angular/core";
import { NavOption } from "src/app/models/nav-option";

@Component({
	selector: "app-nav-bar",
	templateUrl: "./nav-bar.component.html",
	styleUrls: ["./nav-bar.component.css"],
})
export class NavBarComponent implements OnInit {
	readonly navOptions: NavOption[] = [
		{
			name: "Libri",
			route: "",
		},
		{
			name: "Autori",
			route: "authors",
		},
		{
			name: "Logs",
			route: "logs",
		},
	];

	constructor() {}

	ngOnInit(): void {}
}
