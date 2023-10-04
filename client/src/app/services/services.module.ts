import { NgModule } from "@angular/core";
import { BookService } from "./book.service";
import { HttpClientModule } from "@angular/common/http";
import { UserService } from "./user.service";
import { LogsService } from "./logs.service";

@NgModule({
	declarations: [],
	imports: [HttpClientModule],
	providers: [UserService, BookService, LogsService],
})
export class ServicesModule {}
