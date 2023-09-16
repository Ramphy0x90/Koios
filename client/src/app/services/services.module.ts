import { NgModule } from "@angular/core";
import { BookService } from "./book.service";
import { HttpClientModule } from "@angular/common/http";
import { AuthorService } from "./author.service";

@NgModule({
	declarations: [],
	imports: [HttpClientModule],
	providers: [BookService, AuthorService],
})
export class ServicesModule {}
