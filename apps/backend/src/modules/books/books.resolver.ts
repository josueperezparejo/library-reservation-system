import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";

import { Book } from "./entities/book.entity";
import { BooksService } from "./books.service";
import { CreateBookInput } from "./dto/create-book.input";
import { UpdateBookInput } from "./dto/update-book.input";

@Resolver(() => Book)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  @Mutation(() => Book, { description: "Create a new book" })
  createBook(@Args("input") input: CreateBookInput) {
    return this.booksService.create(input);
  }

  @Query(() => [Book], { description: "Get all books" })
  books() {
    return this.booksService.findAll();
  }

  @Query(() => [Book], {
    description: "Get all available books (no active reservation)",
  })
  availableBooks() {
    return this.booksService.findAvailable();
  }

  @Query(() => Book, { description: "Get a book by ID" })
  book(@Args("id", { type: () => ID }) id: string) {
    return this.booksService.findById(id);
  }

  @Mutation(() => Book, { description: "Update an existing book" })
  updateBook(@Args("input") input: UpdateBookInput) {
    return this.booksService.update(input);
  }

  @Mutation(() => Book, { description: "Delete a book" })
  deleteBook(@Args("id", { type: () => ID }) id: string) {
    return this.booksService.delete(id);
  }
}
