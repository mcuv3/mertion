import { Field, InputType, Int } from "type-graphql";
import { Validator } from "../validation/Validator";
import { Length, Required } from "../validation/validator_config";

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
