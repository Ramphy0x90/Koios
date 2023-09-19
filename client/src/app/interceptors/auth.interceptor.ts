import { Injectable } from "@angular/core";
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { UserService } from "../services/user.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	userLogged: boolean = false;

	constructor(private userService: UserService) {
		this.userService.isLogged$.subscribe((status) => {
			this.userLogged = status;
		});
	}

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		let userToken = this.userService.getUserToken();

		if (this.userLogged && userToken) {
			request = request.clone({
				setHeaders: {
					Authorization: `Bearer ${userToken}`,
				},
			});
		}

		return next.handle(request);
	}
}
