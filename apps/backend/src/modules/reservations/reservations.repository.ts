import { Injectable } from "@nestjs/common";
import { ReservationStatus } from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";
import { IPaginatedType } from "../../common/pagination/paginated.type";

interface DateRangeFilter {
  fromDate?: string;
  toDate?: string;
}

interface PaginatedQuery extends DateRangeFilter {
  page: number;
  limit: number;
}

@Injectable()
export class ReservationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    userId: string;
    bookId: string;
    reservationDate: Date;
    dueDate: Date;
  }) {
    return this.prisma.reservation.create({
      data,
      include: { user: true, book: true },
    });
  }

  async findAll({
    page,
    limit,
  }: PaginatedQuery): Promise<IPaginatedType<any>> {
    return this.paginate({}, page, limit);
  }

  async findByBook(
    bookId: string,
    { page, limit, fromDate, toDate }: PaginatedQuery,
  ): Promise<IPaginatedType<any>> {
    const where = this.buildWhereClause({ bookId }, { fromDate, toDate });
    return this.paginate(where, page, limit);
  }

  async findByUser(
    userId: string,
    { page, limit, fromDate, toDate }: PaginatedQuery,
  ): Promise<IPaginatedType<any>> {
    const where = this.buildWhereClause({ userId }, { fromDate, toDate });
    return this.paginate(where, page, limit);
  }

  async findActiveByBook(bookId: string) {
    return this.prisma.reservation.findFirst({
      where: { bookId, status: ReservationStatus.ACTIVE },
    });
  }

  async countActiveByUser(userId: string): Promise<number> {
    return this.prisma.reservation.count({
      where: { userId, status: ReservationStatus.ACTIVE },
    });
  }

  async findById(id: string) {
    return this.prisma.reservation.findUnique({
      where: { id },
      include: { user: true, book: true },
    });
  }

  async returnBook(id: string) {
    return this.prisma.reservation.update({
      where: { id },
      data: {
        status: ReservationStatus.RETURNED,
        returnDate: new Date(),
      },
      include: { user: true, book: true },
    });
  }

  private buildWhereClause(
    baseFilter: object,
    { fromDate, toDate }: DateRangeFilter,
  ) {
    const dateFilter: any = {};

    if (fromDate || toDate) {
      dateFilter.reservationDate = {};
      if (fromDate) dateFilter.reservationDate.gte = new Date(fromDate);
      if (toDate) dateFilter.reservationDate.lte = new Date(toDate);
    }

    return { ...baseFilter, ...dateFilter };
  }

  private async paginate(
    where: object,
    page: number,
    limit: number,
  ): Promise<IPaginatedType<any>> {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.reservation.findMany({
        where,
        include: { user: true, book: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.reservation.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
    };
  }
}
