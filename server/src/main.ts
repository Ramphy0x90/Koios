import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Response, NextFunction } from "express";
import { UserSeedService } from "./db/seed/userSeed.service";
import { AuthorSeedService } from "./db/seed/authorsSeed.service";
import { BookSeedService } from "./db/seed/booksSeed.service";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: [
			"http://localhost:4200",
			"http://koios.devracom.ch",
			"http://cde-lista-doppioni.ch",
		],
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	});

	const userSeedService = app.get(UserSeedService);
	await userSeedService.seedData();

	const authorsSeedService = app.get(AuthorSeedService);
	await authorsSeedService.seedData();

	const booksSeedService = app.get(BookSeedService);
	await booksSeedService.seedData();

	await app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3000);
}
bootstrap();
