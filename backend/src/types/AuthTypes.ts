import { Field, InputType, Int, ObjectType } from "type-graphql";
import { User } from "../entities/User";
import { StandardResponse } from "../error/StandardResponse";
import { Validator } from "../validation/Validator";
import {
  Length,
  PositiveNumber,
  Required,
} from "../validation/validator_config";
import { Success } from "./GeneralTypes";

@InputType()
export class SingUpInput extends Validator {
  fields = {};
  className = SingUpInput.name;

  @Length({ max: 100, min: 4 })
  @Required
  @Field()
  name!: string;

  @Required
  @Field()
  username!: string;

  @Length({ max: 100, min: 18 })
  @PositiveNumber
  @Required
  @Field(() => Int)
  age?: number;

  @Required
  @Field()
  email!: string;

  @Required
  @Field()
  password!: string;

  @Field(() => String, { nullable: true })
  about?: string;

  constructor(fields: SingUpInput) {
    super();
    this.fields = fields;
  }
}

@ObjectType()
export class MeResponse extends StandardResponse {
  @Field()
  email?: string;
  @Field()
  id?: string;
  @Field()
  username?: string;
  @Field()
  picture?: string;
  @Field()
  about?: string;
  @Field()
  name?: string;
  @Field()
  backgroundPicture?: string;
  @Field()
  age?: number;
}

@ObjectType()
export class SignUpResponse extends StandardResponse {}

@InputType()
export class SingInInput extends Validator {
  fields = {};
  className = SingInInput.name;

  @Required
  @Field()
  email!: string;

  @Required
  @Field()
  password!: string;

  constructor(fields: SingInInput) {
    super();
    this.fields = fields;
  }
}

@InputType()
export class Me {
  @Field()
  username!: string;
  @Field()
  email!: string;
}
