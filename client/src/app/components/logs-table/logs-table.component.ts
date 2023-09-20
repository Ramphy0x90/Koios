import { Component, Input } from "@angular/core";
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
		{ id: "changes", title: "Modifiche" },
		{ id: "updatedAt", title: "Data" },
	];

	updateData(data: Log[]): void {
		this.data = data;
	}
}
