import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";

import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User, { description: "Create a new library user" })
  createUser(@Args("input") input: CreateUserInput) {
    return this.usersService.create(input);
  }

  @Query(() => [User], { description: "Get all users" })
  users() {
    return this.usersService.findAll();
  }

  @Query(() => User, { description: "Get a user by ID" })
  user(@Args("id", { type: () => ID }) id: string) {
    return this.usersService.findById(id);
  }

  @Mutation(() => User, { description: "Update an existing user" })
  updateUser(@Args("input") input: UpdateUserInput) {
    return this.usersService.update(input);
  }

  @Mutation(() => User, { description: "Delete a user" })
  deleteUser(@Args("id", { type: () => ID }) id: string) {
    return this.usersService.delete(id);
  }
}
