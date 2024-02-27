import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Book } from "src/schemas/book.schema";
import _ from "lodash";
import { LogService } from "../log/log.service";
import { Log } from "src/schemas/log.schema";
import { Worksheet, Cell } from "exceljs";
import * as PDFDocument from 'pdfkit';
import * as path from "path";
import { Guest } from "src/schemas/guest.schema";

const ExcelJS = require("exceljs");

@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name) private bookModel: Model<Book>,
        @InjectModel(Guest.name) private guestModel: Model<Guest>,
        private logService: LogService
    ) { }

    async getAll(from: number, limit: number): Promise<Book[]> {
        const query = this.bookModel.find();

        if (limit > 0) {
            query.skip(from).limit(limit);
        }

        return await query.exec();
    }

    async search(term: string): Promise<Book[]> {
        let result = this.bookModel.find();
        let regex = new RegExp(term, "i");

        result.where({
            $or: [
                { requestor: { $in: [regex] } },
                { authors: regex },
                { title: regex },
                { topic: regex },
                { notes1: regex },
                { notes2: regex },
            ],
        });

        return await result.exec();
    }

    async filter(term: string): Promise<Book[]> {
        let result = this.bookModel.find();

        if (term == "booksNoRequestors") {
            result.where({ requestor: { $size: 0 } });
        } else if (term == "booksRequestor") {
            result.where({ requestor: { $not: { $size: 0 } } });
        } else if (term == "booksDisabled") {
            result.where({ status: false });
        }

        return await result.exec();
    }

    async getById(id: string): Promise<Book> {
        return await this.bookModel.findById(id).exec();
    }

    async create(bookDto): Promise<Book> {
        bookDto.author = bookDto.author == "" ? null : bookDto.author;
        bookDto.place = bookDto.place == "" ? null : bookDto.place;

        const newBook = new this.bookModel(bookDto);
        await this.logService.create(<Log>{
            entity: "Book",
            target: "",
            operation: "CREATE",
            changes: "",
        });

        return await newBook.save();
    }

    async update(id: string, book: Book): Promise<Book> {
        await this.logService.create(<Log>{
            entity: "Book",
            target: id,
            operation: "UPDATE",
            changes: "",
        });

        return await this.bookModel.findByIdAndUpdate(id, book, { new: true });
    }

    async delete(id: string): Promise<object> {
        await this.logService.create(<Log>{
            entity: "Book",
            target: id,
            operation: "DELETE",
            changes: "",
        });

        return await this.bookModel.deleteOne({ _id: id });
    }

    async generatePDF(guest: string): Promise<Buffer> {
        const books: Book[] = await this.bookModel.find({ requestor: { $in: [guest] } }).exec();

        const pdfBuffer: Buffer = await new Promise(resolve => {
            const doc = new PDFDocument({
                size: 'LETTER',
                bufferPages: true,
            });

            const margin = 50;
            const lineBase = 150;
            const lineSpacing = 20;

            const date = new Date().toLocaleDateString('en-GB');

            const imageSizeWidth = 1118;
            const imageSizeHeight = 147;
            const imagePath = path.join(process.cwd(), "src/static/images/logo.png");
            doc.image(imagePath, margin, margin, { width: imageSizeWidth / 5, height: imageSizeHeight / 5 });

            doc.font('Helvetica-Bold');
            doc.text("Resoconto libri riservati", margin, lineBase);

            doc.font('Helvetica');
            doc.text(guest, margin, lineBase + lineSpacing * 2);
            doc.text(date, margin, lineBase + lineSpacing * 3);

            doc.fontSize(11);
            const listBase = lineBase + lineSpacing * 5;

            if (books.length == 0) {
                doc.text("Nessun libro riservato", margin, listBase);
            } else {
                books.forEach((book, index) => {
                    doc.text(`• ${book.title}`, margin, listBase + (lineSpacing * index * 2));
                });
            }

            doc.end();

            const buffer = []
            doc.on('data', buffer.push.bind(buffer))
            doc.on('end', () => {
                const data = Buffer.concat(buffer)
                resolve(data)
            })
        })

        return pdfBuffer
    }

    async import(file, append) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer);
        const worksheet: Worksheet = workbook.worksheets[0];
        const totalRows = worksheet.rowCount;

        let books: Book[] = [];

        for (const row of worksheet.getRows(1, totalRows)) {
            let authors = row.getCell(2).value?.toString() || "";
            let title = this.extractCellValue(row.getCell(3));
            let year = row.getCell(4).value?.valueOf();
            let topic = row.getCell(5).value?.toString() || "";
            let place = row.getCell(6).value?.toString() || "";
            let notes1 = row.getCell(7).value?.toString() || "";
            let notes2 = row.getCell(8).value?.toString() || "";

            const book = {
                status: true,
                requestor: [],
                authors: authors,
                title: title,
                year: !Number.isNaN(Number(year)) ? Number(year) : null,
                topic: topic,
                place: place,
                notes1: notes1,
                notes2: notes2
            };

            books.push(<Book>book);
        }

        if (append == "false") {
            await this.bookModel.deleteMany({})
        }

        await this.bookModel.create(books);
    }

    private extractCellValue(cell: Cell): string {
        const cellValue = cell.value;

        if (typeof cellValue == "string") {
            return cellValue;
        } else if (cellValue?.["richText"]) {
            return cellValue["richText"].map(({ text }) => text).join("");
        }

        return "-";
    }
}
