import { GraphQLUpload } from "graphql-upload";
import { Field, InputType, ObjectType } from "type-graphql";
import { Mert } from "../entities/Mert";
import { ErrorResponse } from "../error/ErrorResponse";
import { Upload } from "../types";
import { Validator } from "../validation/Validator";
import { ImageFile, Required } from "../validation/validator_config";

@InputType()
export class MertInput extends Validator {
  fields = {};
  className = MertInput.name;

  @Required
  @Field()
  mert!: string;

  @ImageFile
  @Field(() => GraphQLUpload, { nullable: true })
  picture?: Upload;

  @Field({ nullable: true })
  fatherId?: string;

  constructor(fields: MertInput) {
    super();
    this.fields = fields;
  }
}

@ObjectType()
export class MertCreationResponse extends ErrorResponse {
  @Field(() => Mert, { nullable: true })
  mert?: Mert;
}
