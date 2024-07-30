import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BooksComponent } from "./containers/books/books.component";
import { LogComponent } from "./containers/log/log.component";
import { LoginComponent } from "./containers/login/login.component";
import { authGuard } from "./guards/auth.guard";
import { AdminComponent } from "./containers/admin/admin.component";
import { guestGuard } from "./guards/guest.guard";
import { TutorialComponent } from "./containers/tutorial/tutorial.component";

const routes: Routes = [
    { path: "", pathMatch: "full", redirectTo: "login" },
    {
        path: "guest/:guest",
        canActivate: [guestGuard],
        children: [
            { path: "books", component: BooksComponent },
            { path: "books/:page", component: BooksComponent },
            { path: "books/:page/:id", component: BooksComponent },
        ],
    },
    {
        path: "books",
        component: BooksComponent,
        canActivate: [authGuard],
    },
    {
        path: "books/:page",
        component: BooksComponent,
        canActivate: [authGuard],
    },
    {
        path: "books/:page/:id",
        component: BooksComponent,
        canActivate: [authGuard],
    },
    {
        path: "logs",
        component: LogComponent,
        canActivate: [authGuard],
    },
    {
        path: "admin",
        component: AdminComponent,
        canActivate: [authGuard],
    },
    {
        path: "login",
        component: LoginComponent,
    },
    {
        path: "tutorial",
        component: TutorialComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule { }
