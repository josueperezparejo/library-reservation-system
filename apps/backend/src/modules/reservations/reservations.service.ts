import { Injectable } from "@nestjs/common";
import { ReservationStatus } from "@prisma/client";

import { ReservationsRepository } from "./reservations.repository";

import { UsersService } from "../users/users.service";
import { BooksService } from "../books/books.service";

import { CreateReservationInput } from "./dto/create-reservation.input";

import {
  ReservationsByBookArgs,
  ReservationsByUserArgs,
} from "./dto/reservation-filters.args";
import { PaginationArgs } from "../../common/pagination/pagination.args";

import {
  InvalidDateRangeException,
  BookAlreadyReservedException,
  ReservationNotFoundException,
  UserReservationLimitException,
  ReservationAlreadyReturnedException,
} from "../../common/exceptions/business.exception";

const MAX_ACTIVE_RESERVATIONS = 3;

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    private readonly usersService: UsersService,
    private readonly booksService: BooksService,
  ) {}

  async create(input: CreateReservationInput) {
    const reservationDate = new Date(input.reservationDate);
    const dueDate = new Date(input.dueDate);

    if (dueDate <= reservationDate) throw new InvalidDateRangeException();

    // Validate user and book exist (throws if not found)
    await Promise.all([
      this.usersService.findById(input.userId),
      this.booksService.findById(input.bookId),
    ]);

    // Business rule: book cannot have more than one active reservation
    const activeReservation =
      await this.reservationsRepository.findActiveByBook(input.bookId);
    if (activeReservation) throw new BookAlreadyReservedException();

    // Business rule: user cannot have more than 3 active reservations
    const activeCount = await this.reservationsRepository.countActiveByUser(
      input.userId,
    );
    if (activeCount >= MAX_ACTIVE_RESERVATIONS)
      throw new UserReservationLimitException();

    return this.reservationsRepository.create({
      userId: input.userId,
      bookId: input.bookId,
      reservationDate,
      dueDate,
    });
  }

  async findAll(args: PaginationArgs) {
    return this.reservationsRepository.findAll({
      page: args.page ?? 1,
      limit: args.limit ?? 20,
    });
  }

  async findByBook(args: ReservationsByBookArgs) {
    await this.booksService.findById(args.bookId);
    return this.reservationsRepository.findByBook(args.bookId, {
      page: args.page,
      limit: args.limit,
      fromDate: args.fromDate,
      toDate: args.toDate,
    });
  }

  async findByUser(args: ReservationsByUserArgs) {
    await this.usersService.findById(args.userId);
    return this.reservationsRepository.findByUser(args.userId, {
      page: args.page,
      limit: args.limit,
      fromDate: args.fromDate,
      toDate: args.toDate,
    });
  }

  async returnBook(reservationId: string) {
    const reservation =
      await this.reservationsRepository.findById(reservationId);
    if (!reservation) throw new ReservationNotFoundException(reservationId);

    // Business rule: cannot return an already-returned book
    if (reservation.status === ReservationStatus.RETURNED) {
      throw new ReservationAlreadyReturnedException();
    }

    return this.reservationsRepository.returnBook(reservationId);
  }

  async findById(id: string) {
    const reservation = await this.reservationsRepository.findById(id);
    if (!reservation) throw new ReservationNotFoundException(id);
    return reservation;
  }
}
