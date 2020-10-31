import { Field, Int, ObjectType, InputType } from "type-graphql";
import { BaseEntity, Column, Entity, Generated, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field()
  @Column("text")
  name!: string;

  @Field()
  @Column("text", { unique: true })
  username!: string;

  @Field(() => Int)
  @Column("integer")
  age!: number;

  @Field()
  @Column("text", { unique: true })
  email!: string;

  @Field()
  @Column("text")
  password!: string;

  @Field()
  @Column("text")
  about!: string;

  @Field()
  @Column("varchar")
  picture!: string;
}
