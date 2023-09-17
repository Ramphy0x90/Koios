import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

@Schema({ timestamps: true })
export class Author {
	@Prop()
	name: string;

	@Prop()
	surname: string;

	@Prop({ default: mongoose.now() })
	createdAt: Date;

	@Prop({ default: mongoose.now() })
	updatedAt: Date;
}

export type AuthorDocument = HydratedDocument<Author>;
export const AuthorSchema = SchemaFactory.createForClass(Author);

AuthorSchema.set("toObject", { virtuals: true });
AuthorSchema.set("toJSON", { virtuals: true });

AuthorSchema.virtual("books", {
	ref: "Book",
	localField: "_id",
	foreignField: "author",
});
