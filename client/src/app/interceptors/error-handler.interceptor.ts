import { Injectable } from "@angular/core";
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpErrorResponse,
} from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { AuthorService } from "../services/author.service";
import { UserService } from "../services/user.service";

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
	constructor(
		private userService: UserService,
		private toastr: ToastrService
	) {}

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		return next.handle(request).pipe(
			catchError((error: HttpErrorResponse) => {
				let msg: string;

				if (!error.ok && error.status == 0) {
					msg = "Server non raggiungibile :(";
				} else if (error.error.error) {
					msg = `${error.error.error}`;
				} else if (error.error.message) {
					msg = `${error.error.message}`;
				} else {
					msg = "Errore scnonoschiuto";
				}

				if (error.status == 401) {
					this.userService.logOut();
				}

				this.toastr.warning(msg);
				return throwError(() => msg);
			})
		);
	}
}