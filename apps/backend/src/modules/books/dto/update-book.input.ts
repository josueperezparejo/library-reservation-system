import { Field, ID, InputType, PartialType } from "@nestjs/graphql";

import { CreateBookInput } from "./create-book.input";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class UpdateBookInput extends PartialType(CreateBookInput) {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id: string;
}
