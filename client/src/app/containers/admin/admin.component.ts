import { Component, OnInit } from "@angular/core";
import { take } from "rxjs";
import { Book } from "src/app/models/book";
import { User } from "src/app/models/user";
import { UserRegister } from "src/app/models/userRegister";
import { BookService } from "src/app/services/book.service";
import { UserService } from "src/app/services/user.service";
import _ from "lodash";

export enum Mode {
	READ,
	NEW,
	EDIT,
}

@Component({
	selector: "app-admin",
	templateUrl: "./admin.component.html",
	styleUrls: ["./admin.component.css"],
})
export class AdminComponent implements OnInit {
	modeEnum = Mode;
	mode: Mode = Mode.READ;

	users: User[] = [];
	selectedUser?: User;
	userTemplate: UserRegister = {
		name: "",
		surname: "",
		email: "",
		password: "",
	};

	books: Book[] = [];

	constructor(
		private userService: UserService,
		private bookService: BookService
	) {}

	ngOnInit(): void {
		this.fetchUsers();
		this.fetchBooks();
	}

	isOnNewUser(item: unknown): item is UserRegister {
		return _.has(item, "password");
	}

	fetchBooks(): void {
		this.bookService.getAll().subscribe((books) => {
			this.books = books;
		});
	}

	fetchUsers(): void {
		this.userService
			.getAll()
			.pipe(take(1))
			.subscribe((users) => {
				this.users = users;

				if (this.users.length > 0) {
					this.selectedUser = this.users[0];
				}
			});
	}

	selectUser(user: User): void {
		this.selectedUser = user;
	}

	createUser(): void {
		this.mode = Mode.NEW;
		this.selectedUser = { ...this.userTemplate };
	}

	updateUser(): void {}

	saveUser(): void {
		if (this.mode == Mode.NEW) {
			this.userService
				.register(<UserRegister>this.selectedUser)
				.subscribe((data) => {
					this.mode = Mode.READ;
					this.selectedUser = { ...data };
					this.fetchUsers();
				});
		}
	}

	cancel(): void {
		this.mode = Mode.READ;
		this.selectedUser = this.users[0];
	}
}
