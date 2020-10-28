import { Field, ObjectType, Query, Resolver } from "type-graphql";

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
  @Query(() => Me)
  yo(): Me {
    return { name: "Mao" };
  }
}
