import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavOption } from "src/app/models/navOptions";
import { UserService } from "src/app/services/user.service";

@Component({
	selector: "app-nav-bar",
	templateUrl: "./nav-bar.component.html",
	styleUrls: ["./nav-bar.component.css"],
})
export class NavBarComponent implements OnInit {
	readonly navOptions: NavOption[] = [
		{
			name: "Libri",
			route: "books",
		},
		{
			name: "Autori",
			route: "authors",
		},
	];

	readonly navOptionsAdmin: NavOption[] = [
		{
			name: "Admin",
			route: "admin",
		},
		{
			name: "Logs",
			route: "logs",
		},
	];

	userLogged: boolean = false;

	constructor(private userService: UserService, private router: Router) {
		this.userService.isLogged$.subscribe((status) => {
			this.userLogged = status;
		});
	}

	ngOnInit(): void {}

	logOut(): void {
		this.userService.logOut();
		this.router.navigate(["books"]);
	}
}
