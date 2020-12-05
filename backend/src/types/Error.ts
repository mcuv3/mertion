import { Field, ObjectType } from "type-graphql";
import { Success } from "./Common";

export interface ErrorField {
  field: string;
  error: string;
}
@ObjectType()
class ErrorFieldClass implements ErrorField {
  @Field()
  field!: string;

  @Field()
  error!: string;
}

@ObjectType()
export class StandardResponse extends Success {
  @Field(() => String, { nullable: true })
  message?: string;
  @Field(() => [ErrorFieldClass], { nullable: true })
  errors?: ErrorField[];
}
