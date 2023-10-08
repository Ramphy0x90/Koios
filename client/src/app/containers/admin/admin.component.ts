import { Component, OnInit } from "@angular/core";
import { take } from "rxjs";
import { Book } from "src/app/models/book";
import { User } from "src/app/models/user";
import { UserRegister } from "src/app/models/userRegister";
import { BookService } from "src/app/services/book.service";
import { UserService } from "src/app/services/user.service";
import _ from "lodash";
import { GuestService } from "src/app/services/guest.service";
import { GuestTempAuthResponse } from "src/app/models/guestTempAuthResponse";
import { GuestTokenRequest } from "src/app/models/guestTokenRequest";

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

	selectedUser?: User;
	users: User[] = [];
	userTemplate: UserRegister = {
		name: "",
		surname: "",
		email: "",
		password: "",
	};

	selectedGuest?: GuestTempAuthResponse;
	guests: GuestTempAuthResponse[] = [];
	guestTemplate: GuestTokenRequest = {
		guest: "",
		expirationDate: new Date(),
	};

	books: Book[] = [];

	constructor(
		private userService: UserService,
		private bookService: BookService,
		private guestService: GuestService
	) {}

	ngOnInit(): void {
		this.fetchUsers();
		this.fetchBooks();
		this.fetchGuests();
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

	fetchGuests(): void {
		this.guestService
			.getAll()
			.pipe(take(1))
			.subscribe((guests) => {
				this.guests = guests;
			});
	}

	selectUser(user: User): void {
		this.selectedUser = user;
	}

	selectGuest(guest: GuestTempAuthResponse) {
		this.selectedGuest = guest;
	}

	createUser(): void {
		this.mode = Mode.NEW;
		this.selectedUser = { ...this.userTemplate };
	}

	editUser(): void {
		this.mode = Mode.EDIT;
	}

	deleteUser(): void {
		if (this.selectedUser?._id) {
			this.userService.deleteUser(this.selectedUser._id).subscribe(() => {
				this.fetchUsers();
			});
		}
	}

	saveUser(): void {
		if (this.mode == Mode.NEW) {
			this.userService
				.register(<UserRegister>this.selectedUser)
				.subscribe((data) => {
					this.mode = Mode.READ;
					this.selectedUser = { ...data };
					this.fetchUsers();
				});
		} else if (this.mode == Mode.EDIT) {
			if (this.selectedUser) {
				this.userService
					.updateUser(this.selectedUser)
					.subscribe((data) => {
						this.mode = Mode.READ;
						this.selectedUser = { ...data };
						this.fetchUsers();
					});
			}
		}
	}

	saveGuest(): void {
		this.guestService.generateToken(this.guestTemplate).subscribe(() => {
			this.guestTemplate.guest = "";
			this.guestTemplate.expirationDate = new Date();
			this.fetchGuests();
		});
	}

	cancel(): void {
		this.fetchUsers();
		this.mode = Mode.READ;
		this.selectedUser = this.users[0];
	}

	updateLinksData(data: any): void {}
}
