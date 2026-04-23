import { ReservationStatus } from "@prisma/client";
import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";

import { Book } from "../../books/entities/book.entity";
import { User } from "../../users/entities/user.entity";

registerEnumType(ReservationStatus, {
  name: "ReservationStatus",
  description: "Current status of a reservation",
  valuesMap: {
    ACTIVE: { description: "Reservation is active — book is out" },
    RETURNED: { description: "Book has been returned" },
  },
});

@ObjectType()
export class Reservation {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field(() => ID)
  bookId: string;

  @Field()
  reservationDate: Date;

  @Field()
  dueDate: Date;

  @Field({ nullable: true })
  returnDate?: Date;

  @Field(() => ReservationStatus)
  status: ReservationStatus;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => Book, { nullable: true })
  book?: Book;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
