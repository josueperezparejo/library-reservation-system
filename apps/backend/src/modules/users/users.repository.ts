import { Injectable } from "@nestjs/common";
import { ReservationStatus } from "@prisma/client";

import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserInput) {
    return this.prisma.user.create({ data });
  }

  async findAll() {
    return this.prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: string, data: Omit<UpdateUserInput, "id">) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  async hasActiveReservations(userId: string): Promise<boolean> {
    const count = await this.prisma.reservation.count({
      where: { userId, status: ReservationStatus.ACTIVE },
    });
    return count > 0;
  }
}
