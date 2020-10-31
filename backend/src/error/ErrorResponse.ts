import { Field, ObjectType } from "type-graphql";
import { Success } from "../mutation_types/general";
import { extension } from "../utils/fileExtension";

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
export class ErrorResponse extends Success {
  @Field(()=>String,{nullable:true})
  message?: string;
  @Field(() => [ErrorFieldClass],{nullable:true})
  errors?: ErrorField[];
}
