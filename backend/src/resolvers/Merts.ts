import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { createWriteStream } from "fs";
import { Mert, User } from "../entities";
import { ErrorResponse } from "../error/ErrorResponse";
import {
  MertCreationResponse,
  MertInput,
  Reaction,
  Reactions,
  ReactionsMertResponse,
  UserReactionsResponse,
} from "../types/Mert";
import { MyContext } from "../types";
import { IMAGE_MERT } from "../constants";
import { extension } from "../utils/fileExtension";
import {
  FindConditions,
  FindOneOptions,
  getManager,
  LessThan,
  ObjectLiteral,
} from "typeorm";
import validator from "validator";

@Resolver(Mert)
export class MertsResolver {
  @FieldResolver(() => Mert, { nullable: true })
  async father(@Root() mert: Mert, @Ctx() { mertLoader }: MyContext) {
    return mert.fatherId ? mertLoader.load(mert.fatherId) : null;
  }

  @Authorized()
  @Mutation(() => MertCreationResponse)
  async createMert(
    @Arg("fields") fields: MertInput,
    @Ctx() { req, db }: MyContext
  ): Promise<MertCreationResponse> {
    const errors = new MertInput(fields).validate();
    if (errors.length > 0)
      return {
        errors,
        message: "Validation error",
        success: false,
      };
    let mert: Mert | undefined;
    try {
      mert = await getManager().transaction(async (_) => {
        mert = await _.create(Mert, {
          mert: fields.mert,
          fatherId: fields.fatherId,
          userId: req.session.userId,
          createdAt: new Date().toISOString(),
          likes: [],
          dislikes: [],
        }).save();

        if (fields.picture) {
          const picture = await fields.picture;
          const imageName = mert.id + extension(picture.filename);
          console.log(`http://localhost:4000/merts/${imageName}`);
          mert.picture = `http://localhost:4000/merts/${imageName}`;
          mert.save();

          const success = await new Promise<boolean>((resolve, reject) =>
            picture
              .createReadStream()
              .pipe(createWriteStream(IMAGE_MERT(imageName)))
              .on("finish", () => resolve(true))
              .on("error", (e) => {
                console.log(e);

                reject(false);
              })
          );
          if (!success) throw new Error("Cannot upload the image");
        }
        return mert;
      });
    } catch (e) {
      return {
        success: false,
        message: e.message,
      };
    }
    mert = await Mert.findOne(mert.id, { relations: ["user"] });

    if (!mert) {
      return {
        success: false,
        message: "Sorry we cannot create the mert :(",
      };
    }

    return { mert, success: true };
  }

  @Query(() => Mert, { nullable: true })
  mert(@Arg("mertId", { nullable: true }) mertId: string) {
    if (!mertId) return null;
    return Mert.findOne(mertId, { relations: ["user"] });
  }

  @Query(() => [Mert], { nullable: true })
  merts(
    @Arg("mertId", { nullable: true }) mertId: string,
    @Arg("cursor", { nullable: true }) date: string
  ): Promise<Mert[]> {
    const isDate = validator.toDate(date);

    let conditions: ObjectLiteral = {
      fatherId: mertId,
      createdAt: LessThan(
        date ? new Date(date) : new Date(Date.now()).toISOString()
      ),
    };
    if (!isDate)
      conditions = (qy: any) => {
        console.log(qy);
        qy.where(`\"Mert__user\".\"username\"=:username`, { username: date });
      };
    console.log(conditions);

    return Mert.find({
      take: 10,
      where: conditions,
      relations: ["user"],
      order: {
        createdAt: "DESC",
      },
    });
  }

  @Authorized()
  @Mutation(() => ReactionsMertResponse, { nullable: true })
  async reactMert(
    @Arg("reaction", () => Reactions) reaction: Reactions,
    @Arg("mertId") mertId: string,
    @Ctx() { db, req }: MyContext
  ): Promise<ReactionsMertResponse | null> {
    const mert = await Mert.findOne(mertId);

    if (!mert) return null;

    let likesSet = new Set(mert.likes);
    let dislikesSet = new Set(mert.dislikes);

    if (reaction === Reactions.Like) {
      dislikesSet.delete(req.session.userId);
      likesSet.add(req.session.userId);
    } else {
      dislikesSet.add(req.session.userId);
      likesSet.delete(req.session.userId);
    }
    const likes = Array.from(likesSet);
    const dislikes = Array.from(dislikesSet);

    await Mert.update(mert.id, {
      likes,
      dislikes,
    });

    return {
      likes,
      dislikes,
    };
  }

  @Query(() => UserReactionsResponse)
  async usersReactions(
    @Arg("mertId") mertId: string,
    @Arg("reaction", () => Reactions) reaction: Reactions
  ): Promise<UserReactionsResponse> {
    const mert = await Mert.findOne(mertId);
    if (!mert) return { success: false, message: "Cannot find the mert" };

    let users;

    if (reaction === Reactions.Like) {
      users = mert.likes;
    }
    if (reaction === Reactions.DisLike) {
      users = mert.dislikes;
    }

    if (!users) return { success: false };

    const usersReaction = await User.findByIds(Array.from(users));

    return {
      success: true,
      users: usersReaction,
    };
  }
}
