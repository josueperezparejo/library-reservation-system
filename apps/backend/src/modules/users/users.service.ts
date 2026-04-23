import { Injectable } from "@nestjs/common";

import { UsersRepository } from "./users.repository";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";

import {
  UserNotFoundException,
  DuplicateEmailException,
  UserHasActiveReservationsException,
} from "../../common/exceptions/business.exception";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(input: CreateUserInput) {
    const existing = await this.usersRepository.findByEmail(input.email);
    if (existing) throw new DuplicateEmailException(input.email);

    return this.usersRepository.create(input);
  }

  async findAll() {
    return this.usersRepository.findAll();
  }

  async findById(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new UserNotFoundException(id);
    return user;
  }

  async update(input: UpdateUserInput) {
    await this.findById(input.id);

    if (input.email) {
      const existingWithEmail = await this.usersRepository.findByEmail(
        input.email,
      );
      if (existingWithEmail && existingWithEmail.id !== input.id) {
        throw new DuplicateEmailException(input.email);
      }
    }

    const { id, ...data } = input;
    return this.usersRepository.update(id, data);
  }

  async delete(id: string) {
    await this.findById(id);

    const hasActive = await this.usersRepository.hasActiveReservations(id);
    if (hasActive) throw new UserHasActiveReservationsException();

    return this.usersRepository.delete(id);
  }
}
