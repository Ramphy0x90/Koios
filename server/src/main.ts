import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Response, NextFunction } from "express";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	app.use(function (
		request: Request,
		response: Response,
		next: NextFunction
	) {
		response.setHeader(
			"Access-Control-Allow-Origin",
			"http://localhost:4200"
		);
		next();
	});

	await app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3000);
}
bootstrap();
