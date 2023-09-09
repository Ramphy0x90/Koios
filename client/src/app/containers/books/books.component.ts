import { Component, OnInit } from "@angular/core";
import { InspectModel } from "src/app/components/inspector/inspector.component";
import { Book } from "src/app/models/book";

@Component({
	selector: "app-books",
	templateUrl: "./books.component.html",
	styleUrls: ["./books.component.css"],
})
export class BooksComponent implements OnInit {
	inspectModel = InspectModel;
	books: Book[] = [
		{
			requestor: "",
			author: "CDC Massagno",
			title: "Catalogo documentazione Ticino. A valli e regioni",
			year: 1995,
			topic: "bibliografie.etnografia",
			place: "Svizzera.Ticino",
			notes_1: "",
			notes_2: "",
		},
		{
			requestor: "",
			author: "CDC Massagno",
			title: "Catalogo documentazione Ticino. B1 comuni Sottoceneri",
			year: 1996,
			topic: "bibliografie.etnografia",
			place: "Svizzera.Ticino",
			notes_1: "",
			notes_2: "",
		},
	];
	selectedBook: Book = this.books[0];

	constructor() {}

	ngOnInit(): void {}

	updateBook(book: Book): void {
		this.selectedBook = book;
	}
}
