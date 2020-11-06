import { GraphQLUpload } from "graphql-upload";
import { Field, InputType, ObjectType, registerEnumType } from "type-graphql";
import { User } from "../entities";
import { Mert } from "../entities/Mert";
import { ErrorResponse } from "../error/ErrorResponse";
import { Upload } from "../types";
import { Validator } from "../validation/Validator";
import { ImageFile, Required } from "../validation/validator_config";
import { Success } from "./general";

export enum Reactions {
  Like = "like",
  DisLike = "dislike",
}

registerEnumType(Reactions, {
  name: "Reactions", // this one is mandatory
  description: "like dislike", // this one is optional
});

@InputType()
export class Reaction {
  @Field(() => Reactions)
  reaction!: Reactions;
}

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

@ObjectType()
export class UserReactionsResponse extends ErrorResponse {
  @Field(() => [User])
  users?: User[];
}

@ObjectType()
export class ReactionsMertResponse {
  @Field(() => [String])
  likes?: string[];
  @Field(() => [String])
  dislikes?: string[];
}
