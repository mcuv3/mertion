import { Field, InputType, ObjectType, registerEnumType } from "type-graphql";

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

@ObjectType()
export class Success {
  @Field()
  success?: boolean;
}
