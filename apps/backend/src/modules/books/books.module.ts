import { Module } from "@nestjs/common";

import { BooksService } from "./books.service";
import { BooksResolver } from "./books.resolver";
import { BooksRepository } from "./books.repository";

@Module({
  providers: [BooksResolver, BooksService, BooksRepository],
  exports: [BooksService, BooksRepository],
})
export class BooksModule {}
