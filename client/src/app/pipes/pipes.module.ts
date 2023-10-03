import { NgModule } from "@angular/core";
import { AuthorsFormatPipe } from "./authors-format.pipe";

@NgModule({
	declarations: [AuthorsFormatPipe],
	exports: [AuthorsFormatPipe],
})
export class PipesModule {}
