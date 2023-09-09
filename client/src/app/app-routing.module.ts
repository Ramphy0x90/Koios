import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BooksComponent } from "./containers/books/books.component";
import { AuthorsComponent } from "./containers/authors/authors.component";
import { LogComponent } from "./containers/log/log.component";

const routes: Routes = [
	{ path: "", component: BooksComponent },
	{ path: "books", pathMatch: "full", redirectTo: "" },
	{ path: "authors", component: AuthorsComponent },
	{ path: "logs", component: LogComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
