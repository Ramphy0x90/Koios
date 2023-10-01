import { CanActivateFn, Router } from "@angular/router";
import { UserService } from "../services/user.service";
import { inject } from "@angular/core";
import { GuestService } from "../services/guest.service";

export const authGuard: CanActivateFn = (route, state) => {
	const router: Router = inject(Router);
	const userService: UserService = inject(UserService);
	const guestService: GuestService = inject(GuestService);

	if (!userService.isLogged) {
	}

	return true;
};
