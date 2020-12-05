import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
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
  @Column("varchar", { length: "155" })
  mert!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: string;

  @Field({ nullable: true })
  @Column("text", { nullable: true })
  picture?: string;

  @Field(() => [String])
  @Column("simple-array")
  likes!: string[];

  @Field(() => [String])
  @Column("simple-array")
  dislikes!: string[];

  @Field()
  @Column("uuid", { nullable: true })
  fatherId!: string;

  @Field()
  @Column("uuid", { nullable: true })
  userId!: string;

  @Field(() => User)
  @ManyToOne(() => User, (u) => u.merts)
  user?: User;

  @Field(() => Mert, { nullable: true })
  @OneToOne(() => Mert, { nullable: true })
  father?: Mert;

  @Field(() => Number)
  async comments() {
    // TODO: a better and performate implementation of this
    const [, n] = await Mert.findAndCount({ where: { fatherId: this.id } });
    return n;
  }
}
