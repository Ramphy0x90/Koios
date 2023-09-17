import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import * as mongoose from "mongoose";
import { Author } from "./author.schema";
import { Place } from "./place.schema";

@Schema({ timestamps: true })
export class Book {
	@Prop()
	requestor: string[];

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: "Author",
		required: false,
		default: undefined,
	})
	author: Author;

	@Prop({ required: true })
	title: string;

	@Prop()
	year: number;

	@Prop()
	topic: string;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: "Place",
		required: false,
		default: undefined,
	})
	place: Place;

	@Prop()
	notes: string;

	@Prop({ default: mongoose.now() })
	createdAt: Date;

	@Prop({ default: mongoose.now() })
	updatedAt: Date;
}

export type BookDocument = HydratedDocument<Book>;
export const BookSchema = SchemaFactory.createForClass(Book);

BookSchema.set("toObject", { virtuals: true });
BookSchema.set("toJSON", { virtuals: true });

BookSchema.virtual("authorInfo", {
	ref: "Author",
	localField: "author",
	foreignField: "_id",
	justOne: true,
});
