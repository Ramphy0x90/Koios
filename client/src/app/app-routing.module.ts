import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BooksComponent } from "./containers/books/books.component";
import { AuthorsComponent } from "./containers/authors/authors.component";
import { LogComponent } from "./containers/log/log.component";
import { LoginComponent } from "./containers/login/login.component";
import { RegisterComponent } from "./containers/register/register.component";

const routes: Routes = [
	{ path: "", component: BooksComponent },
	{ path: "books", pathMatch: "full", redirectTo: "" },
	{ path: "authors", component: AuthorsComponent },
	{ path: "logs", component: LogComponent },
	{ path: "login", component: LoginComponent },
	{ path: "register", component: RegisterComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
