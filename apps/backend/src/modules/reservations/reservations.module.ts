import { Module } from "@nestjs/common";

import { ReservationsService } from "./reservations.service";
import { ReservationsResolver } from "./reservations.resolver";
import { ReservationsRepository } from "./reservations.repository";

import { UsersModule } from "../users/users.module";
import { BooksModule } from "../books/books.module";

@Module({
  imports: [UsersModule, BooksModule],
  providers: [
    ReservationsResolver,
    ReservationsService,
    ReservationsRepository,
  ],
})
export class ReservationsModule {}
