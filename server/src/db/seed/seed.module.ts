import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";
import { User, UserSchema } from "src/schemas/user.schema";
import { Author, AuthorSchema } from "src/schemas/author.schema";
import { UserSeedService } from "./userSeed.service";
import { AuthModule } from "src/auth/auth.module";
import { AuthorSeedService } from "./authorsSeed.service";
import { Book, BookSchema } from "src/schemas/book.schema";
import { BookSeedService } from "./booksSeed.service";

@Module({
	imports: [
		AuthModule,
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Author.name, schema: AuthorSchema },
			{ name: Book.name, schema: BookSchema },
		]),
	],
	providers: [UserSeedService, AuthorSeedService, BookSeedService],
	exports: [UserSeedService, AuthorSeedService, BookSeedService],
})
export class SeederModule {}
