import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BookController } from "./controllers/book/book.controller";
import { BookService } from "./services/book/book.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Book, BookSchema } from "./schemas/book.schema";
import { AuthorController } from "./controllers/author/author.controller";
import { PlaceController } from "./controllers/place/place.controller";
import { AuthorService } from "./services/author/author.service";
import { PlaceService } from "./services/place/place.service";
import { Author, AuthorSchema } from "./schemas/author.schema";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.MONGO_URL),
		MongooseModule.forFeature([
			{ name: Book.name, schema: BookSchema },
			{ name: Author.name, schema: AuthorSchema },
		]),
	],
	controllers: [
		AppController,
		BookController,
		AuthorController,
		PlaceController,
	],
	providers: [AppService, BookService, AuthorService, PlaceService],
})
export class AppModule {}
