import { Injectable } from "@nestjs/common";
import { ReservationStatus } from "@prisma/client";

import { CreateBookInput } from "./dto/create-book.input";
import { UpdateBookInput } from "./dto/update-book.input";

import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class BooksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBookInput) {
    return this.prisma.book.create({ data });
  }

  async findAll() {
    return this.prisma.book.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findAllWithActiveReservation() {
    return this.prisma.book.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        reservations: {
          where: { status: ReservationStatus.ACTIVE },
          take: 1,
          select: { id: true },
        },
      },
    });
  }

  async findAvailable() {
    const booksWithActiveReservations = await this.prisma.reservation.findMany({
      where: { status: ReservationStatus.ACTIVE },
      select: { bookId: true },
    });

    const reservedBookIds = booksWithActiveReservations.map((r) => r.bookId);

    return this.prisma.book.findMany({
      where: { id: { notIn: reservedBookIds } },
      orderBy: { title: "asc" },
    });
  }

  async findById(id: string) {
    return this.prisma.book.findUnique({
      where: { id },
      include: {
        reservations: {
          where: { status: ReservationStatus.ACTIVE },
          take: 1,
        },
      },
    });
  }

  async findByIsbn(isbn: string) {
    return this.prisma.book.findUnique({ where: { isbn } });
  }

  async update(id: string, data: Omit<UpdateBookInput, "id">) {
    return this.prisma.book.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.book.delete({ where: { id } });
  }

  async hasActiveReservation(bookId: string): Promise<boolean> {
    const count = await this.prisma.reservation.count({
      where: { bookId, status: ReservationStatus.ACTIVE },
    });
    return count > 0;
  }
}
