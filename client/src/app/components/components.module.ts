import { NgModule } from "@angular/core";
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { CommonModule } from "@angular/common";
import { AppRoutingModule } from "../app-routing.module";
import { InspectorComponent } from "./inspector/inspector.component";
import { TableComponent } from "./table/table.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { DirectivesModule } from "../directives/directives.module";
import { TableActionsComponent } from "./table-actions/table-actions.component";
import { LogsTableComponent } from "./logs-table/logs-table.component";
import { ItemsIslandViewComponent } from "./items-island-view/items-island-view.component";
import { IslandItemComponent } from "./island-item/island-item.component";
import { AdminInfoCardComponent } from "./admin-info-card/admin-info-card.component";
import { PipesModule } from "../pipes/pipes.module";

@NgModule({
	declarations: [
		NavBarComponent,
		InspectorComponent,
		TableComponent,
		TableActionsComponent,
		LogsTableComponent,
		ItemsIslandViewComponent,
		IslandItemComponent,
		AdminInfoCardComponent,
	],
	imports: [
		CommonModule,
		AppRoutingModule,
		FormsModule,
		NgSelectModule,
		DirectivesModule,
		FormsModule,
		ReactiveFormsModule,
		PipesModule,
	],
	exports: [
		NavBarComponent,
		InspectorComponent,
		TableComponent,
		TableActionsComponent,
		LogsTableComponent,
		ItemsIslandViewComponent,
		IslandItemComponent,
		AdminInfoCardComponent,
	],
})
export class ComponentsModule {}
