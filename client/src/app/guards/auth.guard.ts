import { CanActivateFn, Router } from "@angular/router";
import { UserService } from "../services/user.service";
import { inject } from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {
    const router: Router = inject(Router);
    const userService: UserService = inject(UserService);

    if (!userService.isLogged) {
        router.navigate(["login"]);
    }

    return true;
};
