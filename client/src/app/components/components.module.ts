import { NgModule } from "@angular/core";
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { CommonModule } from "@angular/common";
import { AppRoutingModule } from "../app-routing.module";
import { InspectorComponent } from "./inspector/inspector.component";
import { BookTableComponent } from "./book-table/book-table.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { DirectivesModule } from "../directives/directives.module";
import { AuthorTableComponent } from "./author-table/author-table.component";
import { TableActionsComponent } from "./table-actions/table-actions.component";
import { LogsTableComponent } from "./logs-table/logs-table.component";
import { ItemsIslandViewComponent } from "./items-island-view/items-island-view.component";
import { IslandItemComponent } from "./island-item/island-item.component";

@NgModule({
	declarations: [
		NavBarComponent,
		InspectorComponent,
		BookTableComponent,
		AuthorTableComponent,
		TableActionsComponent,
		LogsTableComponent,
		ItemsIslandViewComponent,
		IslandItemComponent,
	],
	imports: [
		CommonModule,
		AppRoutingModule,
		FormsModule,
		NgSelectModule,
		DirectivesModule,
		FormsModule,
		ReactiveFormsModule,
	],
	exports: [
		NavBarComponent,
		InspectorComponent,
		BookTableComponent,
		AuthorTableComponent,
		TableActionsComponent,
		LogsTableComponent,
		ItemsIslandViewComponent,
		IslandItemComponent,
	],
})
export class ComponentsModule {}
