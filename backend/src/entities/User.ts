import { Field, Int, ObjectType, InputType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";
import { validate as validateFields } from "../validation/validator_config";
import { ErrorField } from "../error/ErrorType";
import { SingUpInput } from "../mutation_types/Auth";
import {
  Length,
  PositiveNumber,
  Required,
} from "../validation/validator_config";

@InputType()
@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryColumn("uuid")
  id!: string;

  @Length({ max: 100, min: 5 })
  @Required
  @Field()
  @Column("text")
  name!: string;

  @Required
  @Field()
  @Column("text", { unique: true })
  username!: string;

  @Length({ max: 100, min: 18 })
  @PositiveNumber
  @Required
  @Field(() => Int)
  @Column("integer")
  age!: number;

  @Required
  @Field()
  @Column("text", { unique: true })
  email!: string;

  @Required
  @Field()
  @Column("text")
  password!: string;

  @Required
  @Field()
  @Column("text")
  about!: string;

  @Field()
  @Column("varchar")
  picture!: string;

  constructor(private fields: SingUpInput) {
    super();
    this.fields = fields;
  }

  validate(): ErrorField[] {
    return validateFields("User", this.fields);
  }
}
