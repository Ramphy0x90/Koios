import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import * as mongoose from "mongoose";

@Schema({ timestamps: true })
export class Book {
	@Prop()
	status: boolean;

	@Prop()
	requestor: string[];

	@Prop()
	authors: string;

	@Prop({ required: true })
	title: string;

	@Prop()
	year: number;

	@Prop()
	topic: string;

	@Prop()
	place: string;

	@Prop()
    notes1: string;
    
    @Prop()
	notes2: string;

	@Prop({ default: mongoose.now() })
	createdAt: Date;

	@Prop({ default: mongoose.now() })
	updatedAt: Date;
}

export type BookDocument = HydratedDocument<Book>;
export const BookSchema = SchemaFactory.createForClass(Book);

BookSchema.set("toObject", { virtuals: true });
BookSchema.set("toJSON", { virtuals: true });
