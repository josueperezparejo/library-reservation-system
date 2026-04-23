import { ArgsType, Field, ID } from "@nestjs/graphql";
import { IsDateString, IsOptional, IsString } from "class-validator";
import { PaginationArgs } from "../../../common/pagination/pagination.args";

@ArgsType()
export class ReservationsByBookArgs extends PaginationArgs {
  @Field(() => ID)
  @IsString()
  bookId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  toDate?: string;
}

@ArgsType()
export class ReservationsByUserArgs extends PaginationArgs {
  @Field(() => ID)
  @IsString()
  userId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  toDate?: string;
}
