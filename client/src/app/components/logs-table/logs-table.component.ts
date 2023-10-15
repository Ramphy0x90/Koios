import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { Log } from "src/app/models/log";

@Component({
	selector: "app-logs-table",
	templateUrl: "./logs-table.component.html",
	styleUrls: ["./logs-table.component.css"],
})
export class LogsTableComponent {
	@Input() data: Log[] = [];

	tableColumns = [
		{ id: "entity", title: "Entità" },
		{ id: "target", title: "Soggetto" },
		{ id: "operation", title: "Operazione" },
		{ id: "executer", title: "Esecutore" },
		{ id: "updatedAt", title: "Data" },
	];

	constructor(private router: Router) {}

	updateData(data: Log[]): void {
		this.data = data;
	}

	goTo(elementId: string): void {
		this.router.navigate(["books", elementId]);
	}
}
