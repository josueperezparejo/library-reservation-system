import { Field, InputType } from "@nestjs/graphql";

import {
  IsUrl,
  IsString,
  MaxLength,
  IsNotEmpty,
  IsOptional,
} from "class-validator";

@InputType()
export class CreateBookInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  author: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  isbn: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  coverUrl?: string;
}
