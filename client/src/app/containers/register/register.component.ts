import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UserService } from "src/app/services/user.service";

@Component({
	selector: "app-register",
	templateUrl: "./register.component.html",
	styleUrls: ["./register.component.css"],
})
export class RegisterComponent {
	registerForm: FormGroup = new FormGroup({
		name: new FormControl(null, [Validators.required]),
		surname: new FormControl(null, [Validators.required]),
		email: new FormControl(null, [Validators.required, Validators.email]),
		password: new FormControl(),
	});

	constructor(private userService: UserService) {}

	register(): void {
		this.userService.register({
			name: this.name?.value,
			surname: this.surname?.value,
			email: this.email?.value,
			password: this.password?.value,
		});
	}

	get name() {
		return this.registerForm.get("name");
	}

	get surname() {
		return this.registerForm.get("surname");
	}

	get email() {
		return this.registerForm.get("email");
	}

	get password() {
		return this.registerForm.get("password");
	}
}
