import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { UserSeedService } from "./db/seed/userSeed.service";
import { BookSeedService } from "./db/seed/booksSeed.service";

const tls = require("tls");
tls.DEFAULT_MAX_VERSION = "TLSv1.2";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: [
			"http://localhost:4200",
			"http://koios.devracom.ch",
			"http://cde-lista-doppioni.ch",
			"https://cde-lista-doppioni.ch",
		],
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	});

	const userSeedService = app.get(UserSeedService);
	await userSeedService.seedData();

	const booksSeedService = app.get(BookSeedService);
	await booksSeedService.seedData();

	await app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3000);
}
bootstrap();
