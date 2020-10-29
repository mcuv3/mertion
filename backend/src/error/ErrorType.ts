import { Field, InputType, ObjectType } from "type-graphql";

export interface ErrorField {
  field: string;
  error: string;
}

@InputType()
export class ErrorType {
  @Field()
  message!: string;
  @Field()
  errors!: ErrorField[];
}
