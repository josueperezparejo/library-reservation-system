import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";

import { Reservation } from "./entities/reservation.entity";
import { ReservationsService } from "./reservations.service";
import { PaginatedReservations } from "./entities/paginated-reservations.entity";

import { CreateReservationInput } from "./dto/create-reservation.input";
import { PaginationArgs } from "../../common/pagination/pagination.args";

import {
  ReservationsByBookArgs,
  ReservationsByUserArgs,
} from "./dto/reservation-filters.args";

@Resolver(() => Reservation)
export class ReservationsResolver {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Mutation(() => Reservation, { description: "Create a new reservation" })
  createReservation(@Args("input") input: CreateReservationInput) {
    return this.reservationsService.create(input);
  }

  @Mutation(() => Reservation, { description: "Return a reserved book" })
  returnBook(@Args("reservationId", { type: () => ID }) reservationId: string) {
    return this.reservationsService.returnBook(reservationId);
  }

  @Query(() => PaginatedReservations, {
    description: "Get all reservations ordered by most recent",
  })
  reservations(@Args() args: PaginationArgs) {
    return this.reservationsService.findAll(args);
  }

  @Query(() => PaginatedReservations, {
    description:
      "Get reservations for a specific book with optional date filter",
  })
  reservationsByBook(@Args() args: ReservationsByBookArgs) {
    return this.reservationsService.findByBook(args);
  }

  @Query(() => PaginatedReservations, {
    description:
      "Get reservations for a specific user with optional date filter",
  })
  reservationsByUser(@Args() args: ReservationsByUserArgs) {
    return this.reservationsService.findByUser(args);
  }

  @Query(() => Reservation, { description: "Get a reservation by ID" })
  reservation(@Args("id", { type: () => ID }) id: string) {
    return this.reservationsService.findById(id);
  }
}
