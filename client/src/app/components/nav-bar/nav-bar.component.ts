import { Component, OnInit } from "@angular/core";
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
			route: "",
		},
		{
			name: "Autori",
			route: "authors",
		},
	];

	userLogged: boolean = false;

	constructor(private userService: UserService) {
		this.userService.isLogged$.subscribe((status) => {
			this.userLogged = status;
		});
	}

	ngOnInit(): void {}

	logOut(): void {
		this.userService.logOut();
	}
}
