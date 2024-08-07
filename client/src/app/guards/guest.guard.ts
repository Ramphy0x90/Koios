import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { GuestService } from "../services/guest.service";

export const guestGuard: CanActivateFn = (route, state) => {
    const router: Router = inject(Router);
    const guestService: GuestService = inject(GuestService);
    const guestId = route.params["guest"];

    guestService.validateToken(guestId).subscribe((data) => {
        if (data.token !== guestService.getCurrentToken() || !data.isValid) {
            window.localStorage.removeItem("guestId");
            window.localStorage.removeItem("guestToken");
        }

        if (!data.isValid) {
            router.navigate(["login"]);
        } else {
            window.localStorage.setItem("guestId", guestId);
            window.localStorage.setItem("guestToken", data.token);
        }
    });

    return true;
};
