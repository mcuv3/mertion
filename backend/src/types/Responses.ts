import { Field, ObjectType } from "type-graphql";
import { Mert, User } from "../entities";
import { StandardResponse } from "./Error";

@ObjectType()
export class MertCreationResponse extends StandardResponse {
  @Field(() => Mert, { nullable: true })
  mert?: Mert;
}

@ObjectType()
export class UserReactionsResponse extends StandardResponse {
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

@ObjectType()
export class MertsResponse {
  @Field(() => [Mert])
  merts!: Mert[];

  @Field()
  hasMore!: boolean;
}

@ObjectType()
export class MeResponse extends StandardResponse {
  @Field({ nullable: true })
  email?: string;
  @Field({ nullable: true })
  id?: string;
  @Field({ nullable: true })
  username?: string;
  @Field({ nullable: true })
  picture?: string;
  @Field({ nullable: true })
  about?: string;
  @Field({ nullable: true })
  name?: string;
  @Field({ nullable: true })
  backgroundPicture?: string;
  @Field({ nullable: true })
  age?: number;
}

@ObjectType()
export class SignUpResponse extends StandardResponse {}

@ObjectType()
export class UserUpdatedResponse extends StandardResponse {
  @Field({ nullable: true })
  picture?: string;
  @Field({ nullable: true })
  backgroundImageUrl?: string;
}
