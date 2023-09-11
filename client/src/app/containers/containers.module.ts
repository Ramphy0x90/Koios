import { NgModule } from "@angular/core";
import { BooksComponent } from "./books/books.component";
import { LogComponent } from "./log/log.component";
import { CommonModule } from "@angular/common";
import { AuthorsComponent } from "./authors/authors.component";
import { ComponentsModule } from "../components/components.module";
import { ServicesModule } from "../services/services.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
	declarations: [BooksComponent, LogComponent, AuthorsComponent],
	imports: [
		CommonModule,
		ComponentsModule,
		ServicesModule,
		FormsModule,
		ReactiveFormsModule,
	],
	exports: [BooksComponent, LogComponent],
})
export class ContainersModule {}
