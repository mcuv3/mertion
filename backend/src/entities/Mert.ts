import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Mert extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field()
  @Column("varchar", { length: "144" })
  mert!: string;

  @Field()
  @Column("text", { nullable: true })
  picture?: string;

  @Field()
  @Column("numeric")
  likes!: number;

  @Field()
  @Column("numeric")
  dislikes!: number;

  @Field(() => User)
  @ManyToOne(() => User, (u) => u.merts)
  user?: User;
}
