import { Field, InputType } from "type-graphql";
import { User } from "../entities/User";
import { ErrorType } from "../error/ErrorType";

@InputType()
export class SingUpInput extends User {}

@InputType()
export class SignInInput extends ErrorType {}

@InputType()
export class Me {
  @Field()
  username!: string;
  @Field()
  email!: string;
}
