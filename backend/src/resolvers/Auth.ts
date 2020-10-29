import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { User } from "../entities/User";
import { ErrorType } from "../error/ErrorType";
import { SingUpInput } from "../mutation_types/Auth";
import { MyContext } from "../types";
@ObjectType()
class Me {
  @Field()
  name!: string;
}
@Resolver()
export class Auth {
  @Query(() => String)
  me(): string {
    return "me";
  }
  @Mutation(() => Boolean || ErrorType)
  async signUp(
    @Arg("fields") fields: SingUpInput,
    @Ctx() ctx: MyContext
  ): Promise<boolean | ErrorType> {
    const errors = new User(fields).validate();
    if (errors.length > 0) {
      return {
        message: "Bad inputs",
        errors,
      };
    }
    return true;
  }
}
