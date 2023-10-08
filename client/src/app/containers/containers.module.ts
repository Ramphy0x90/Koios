import { NgModule } from "@angular/core";
import { BooksComponent } from "./books/books.component";
import { LogComponent } from "./log/log.component";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "../components/components.module";
import { ServicesModule } from "../services/services.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { AdminComponent } from "./admin/admin.component";
import { DirectivesModule } from "../directives/directives.module";

@NgModule({
	declarations: [
		BooksComponent,
		LogComponent,
		LoginComponent,
		RegisterComponent,
		AdminComponent,
	],
	imports: [
		CommonModule,
		ComponentsModule,
		ServicesModule,
		FormsModule,
		ReactiveFormsModule,
		DirectivesModule,
	],
	exports: [BooksComponent, LogComponent],
})
export class ContainersModule {}
