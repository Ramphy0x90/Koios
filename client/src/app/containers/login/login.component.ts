import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup = new FormGroup({
		email: new FormControl(null, [Validators.required, Validators.email]),
		password: new FormControl(),
	});

	constructor(private userService: UserService, private router: Router) {}

	ngOnInit(): void {
		if (this.userService.isLogged) {
			this.router.navigate(["books"]);
		}
	}

	login(): void {
		this.userService
			.login({
				email: this.email?.value,
				password: this.password?.value,
			})
			.subscribe(() => {
				this.router.navigate(["books"]);
			});
	}

	get email() {
		return this.loginForm.get("email");
	}

	get password() {
		return this.loginForm.get("password");
	}
}
