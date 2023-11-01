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
	readonly navOptionsAdmin: NavOption[] = [
		{
			name: "Libri",
			route: "books",
		},
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

    constructor(
        private userService: UserService,
        private router: Router
    ) { }

	ngOnInit(): void {
		this.userService.isLogged$.subscribe((status) => {
			this.userLogged = status;
		});
    }
    
    onClickLogo(): void {
        const guestToken = window.localStorage.getItem("guestToken");

        if (this.userLogged) {
            this.router.navigate(["books"]);
        } else if (guestToken) {
            const tokenId = JSON.parse(guestToken).token;
            this.router.navigate(['/guest', tokenId, 'books']);
        }
    }

	logOut(): void {
		this.userService.logOut();
		this.router.navigate(["login"]);
	}
}
