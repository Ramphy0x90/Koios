import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ContainersModule } from "./containers/containers.module";
import { ComponentsModule } from "./components/components.module";

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		ContainersModule,
		ComponentsModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
