import { BookDto } from "./bookDto";

export interface Book extends BookDto {
	_id: string;
	createdAt: Date;
	updatedAt: Date;
}
