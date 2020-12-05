import { Field, Int, ObjectType, InputType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Mert } from "./Mert";

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
  @Column("text", { default: "" })
  about!: string;

  @Field({ nullable: true })
  @Column("varchar", {
    default: `${process.env.HOST_SERVER}/profile-pictures/default.png`,
  })
  picture!: string;

  @Field({ nullable: true })
  @Column("varchar", {
    default: process.env.HOST_SERVER + "/backgrounds/default.jpg",
  })
  backgroundPicture?: string;

  @OneToMany(() => Mert, (m) => m.user)
  merts!: Mert[];
}
