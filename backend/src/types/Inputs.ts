import { GraphQLUpload } from "graphql-upload";
import { Field, InputType, Int } from "type-graphql";
import { Upload } from "../types";
import { Validator } from "../validation/Validator";
import {
  Length,
  PositiveNumber,
  Required,
} from "../validation/validator_config";

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

@InputType()
export class CreateMertInput extends Validator {
  fields = {};
  className = CreateMertInput.name;

  @Required
  @Field()
  mert!: string;

  @Field({ nullable: true })
  fatherId?: string;

  constructor(fields: CreateMertInput) {
    super();
    this.fields = fields;
  }
}

@InputType()
export class ChangeProfileInput extends Validator {
  fields = {};
  className = ChangeProfileInput.name;

  @Length({ max: 100, min: 5 })
  @Required
  @Field()
  username!: string;

  @Length({ max: 50, min: 5 })
  @Required
  @Field()
  name!: string;

  @Length({ max: 100, min: 18 })
  @Required
  @Field(() => Int)
  age!: number;

  @Field({ nullable: true })
  about?: string;

  constructor(fields: ChangeProfileInput) {
    super();
    this.fields = fields;
  }
}
