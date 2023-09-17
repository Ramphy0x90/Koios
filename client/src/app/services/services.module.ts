import { NgModule } from "@angular/core";
import { BookService } from "./book.service";
import { HttpClientModule } from "@angular/common/http";
import { AuthorService } from "./author.service";
import { UserService } from "./user.service";

@NgModule({
	declarations: [],
	imports: [HttpClientModule],
	providers: [UserService, BookService, AuthorService],
})
export class ServicesModule {}
