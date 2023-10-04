import { Module } from "@nestjs/common";
import { BookController } from "./controllers/book/book.controller";
import { BookService } from "./services/book/book.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Book, BookSchema } from "./schemas/book.schema";
import { ConfigModule } from "@nestjs/config";
import { UserService } from "./services/user/user.service";
import { AuthModule } from "./auth/auth.module";
import { User, UserSchema } from "./schemas/user.schema";
import { UserController } from "./controllers/user/user.controller";
import { SeederModule } from "./db/seed/seed.module";
import { LogService } from "./services/log/log.service";
import { Log, LogSchema } from "./schemas/log.schema";
import { LogController } from "./controllers/log/log.controller";

@Module({
	imports: [
		AuthModule,
		SeederModule,
		ConfigModule.forRoot({ isGlobal: true }),
		MongooseModule.forRoot(process.env.MONGO_URL),
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Book.name, schema: BookSchema },
			{ name: Log.name, schema: LogSchema },
		]),
	],
	controllers: [BookController, UserController, LogController],
	providers: [BookService, UserService, LogService],
})
export class AppModule {}
