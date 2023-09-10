import { NgModule } from "@angular/core";
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { CommonModule } from "@angular/common";
import { AppRoutingModule } from "../app-routing.module";
import { InspectorComponent } from "./inspector/inspector.component";
import { BookTableComponent } from "./book-table/book-table.component";
import { FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";

@NgModule({
	declarations: [NavBarComponent, InspectorComponent, BookTableComponent],
	imports: [CommonModule, AppRoutingModule, FormsModule, NgSelectModule],
	exports: [NavBarComponent, InspectorComponent, BookTableComponent],
})
export class ComponentsModule {}
