import { Injectable } from "@angular/core";
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { UserService } from "../services/user.service";
import { GuestService } from "../services/guest.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    userLogged: boolean = false;

    constructor(
        private userService: UserService,
        private guestService: GuestService
    ) {
        this.userService.isLogged$.subscribe((status) => {
            this.userLogged = status;
        });
    }

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        const userToken = this.userService.getUserToken();
        const guestToken = this.guestService.getCurrentToken();

        if ((userToken && this.userLogged) || (guestToken && !request.url.includes("login"))) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${userToken || guestToken}`,
                },
            });
        }

        return next.handle(request);
    }
}
