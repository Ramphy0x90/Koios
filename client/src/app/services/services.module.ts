import { NgModule } from "@angular/core";
import { BookService } from "./book.service";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
	declarations: [],
	imports: [HttpClientModule],
	providers: [BookService],
})
export class ServicesModule {}
