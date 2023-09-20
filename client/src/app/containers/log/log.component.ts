import { Component, OnInit } from "@angular/core";
import { take } from "rxjs";
import { Log } from "src/app/models/log";
import { LogsService } from "src/app/services/logs.service";

@Component({
	selector: "app-log",
	templateUrl: "./log.component.html",
	styleUrls: ["./log.component.css"],
})
export class LogComponent implements OnInit {
	logs: Log[] = [];

	constructor(private logsService: LogsService) {}

	ngOnInit(): void {
		this.fetchLogs();
	}

	fetchLogs(): void {
		this.logsService
			.getAll()
			.pipe(take(1))
			.subscribe((data) => {
				this.logs = data;
			});
	}
}
