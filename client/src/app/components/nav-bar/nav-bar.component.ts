import { Component, OnInit } from "@angular/core";
import { NavOption } from "src/app/models/navOptions";

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
		{
			name: "Login",
			route: "login",
		},
		{
			name: "Registra",
			route: "register",
		},
	];

	constructor() {}

	ngOnInit(): void {}
}
