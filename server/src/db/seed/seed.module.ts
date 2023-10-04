import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";
import { User, UserSchema } from "src/schemas/user.schema";
import { UserSeedService } from "./userSeed.service";
import { AuthModule } from "src/auth/auth.module";
import { Book, BookSchema } from "src/schemas/book.schema";
import { BookSeedService } from "./booksSeed.service";

@Module({
	imports: [
		AuthModule,
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Book.name, schema: BookSchema },
		]),
	],
	providers: [UserSeedService, BookSeedService],
	exports: [UserSeedService, BookSeedService],
})
export class SeederModule {}
