import { NgModule } from "@angular/core";
import { SortDirective } from "./sort.directive";
import { CommonModule } from "@angular/common";

@NgModule({
	declarations: [SortDirective],
	imports: [CommonModule],
	exports: [SortDirective],
})
export class DirectivesModule {}
