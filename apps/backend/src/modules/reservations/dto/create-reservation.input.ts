import { Field, ID, InputType } from "@nestjs/graphql";
import { IsDateString, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class CreateReservationInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  userId: string;

  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  bookId: string;

  @Field()
  @IsDateString()
  reservationDate: string;

  @Field()
  @IsDateString()
  dueDate: string;
}
