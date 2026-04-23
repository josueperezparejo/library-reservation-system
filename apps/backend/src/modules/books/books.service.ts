import { Injectable } from "@nestjs/common";

import { BooksRepository } from "./books.repository";

import { CreateBookInput } from "./dto/create-book.input";
import { UpdateBookInput } from "./dto/update-book.input";

import {
  BookNotFoundException,
  DuplicateIsbnException,
} from "../../common/exceptions/business.exception";

@Injectable()
export class BooksService {
  constructor(private readonly booksRepository: BooksRepository) {}

  async create(input: CreateBookInput) {
    const existing = await this.booksRepository.findByIsbn(input.isbn);
    if (existing) throw new DuplicateIsbnException(input.isbn);

    return this.booksRepository.create(input);
  }

  async findAll() {
    const books = await this.booksRepository.findAllWithActiveReservation();
    return books.map(({ reservations, ...book }) => ({
      ...book,
      isAvailable: reservations.length === 0,
    }));
  }

  async findAvailable() {
    const books = await this.booksRepository.findAvailable();
    return books.map((book) => ({ ...book, isAvailable: true }));
  }

  async findById(id: string) {
    const book = await this.booksRepository.findById(id);
    if (!book) throw new BookNotFoundException(id);

    const isAvailable = book.reservations.length === 0;
    const { reservations, ...bookData } = book;
    return { ...bookData, isAvailable };
  }

  async update(input: UpdateBookInput) {
    await this.findById(input.id);

    if (input.isbn) {
      const existingWithIsbn = await this.booksRepository.findByIsbn(
        input.isbn,
      );
      if (existingWithIsbn && existingWithIsbn.id !== input.id) {
        throw new DuplicateIsbnException(input.isbn);
      }
    }

    const { id, ...data } = input;
    const updated = await this.booksRepository.update(id, data);
    const isAvailable = !(await this.booksRepository.hasActiveReservation(id));
    return { ...updated, isAvailable };
  }

  async delete(id: string) {
    await this.findById(id);
    return this.booksRepository.delete(id);
  }
}
