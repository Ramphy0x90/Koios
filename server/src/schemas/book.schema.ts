import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import * as mongoose from "mongoose";
import { Author } from "./author.schema";
import { Place } from "./place.schema";

@Schema({ timestamps: true })
export class Book {
	@Prop()
	requestor: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Author" })
	author: Author;

	@Prop({ required: true })
	title: string;

	@Prop()
	year: number;

	@Prop()
	topic: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Place" })
	place: Place;

	@Prop()
	notes_1: string;

	@Prop()
	notes_2: string;

	@Prop({ default: mongoose.now() })
	createdAt: Date;

	@Prop({ default: mongoose.now() })
	updatedAt: Date;
}

export type BookDocument = HydratedDocument<Book>;
export const BookSchema = SchemaFactory.createForClass(Book);
