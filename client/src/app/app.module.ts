import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ContainersModule } from "./containers/containers.module";
import { ComponentsModule } from "./components/components.module";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { ErrorHandlerInterceptor } from "./interceptors/error-handler.interceptor";
import { ToastrModule } from "ngx-toastr";

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		ContainersModule,
		ComponentsModule,
		ToastrModule.forRoot({
			timeOut: 4500,
			positionClass: "toast-top-right",
			preventDuplicates: true,
			progressBar: true,
		}),
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
		{
			provide: HTTP_INTERCEPTORS,
			useClass: ErrorHandlerInterceptor,
			multi: true,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
