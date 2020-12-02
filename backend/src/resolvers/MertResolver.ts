import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";
import { createWriteStream } from "fs";
import { Mert, User } from "../entities";
import {
  MertCreationResponse,
  MertInput,
  MertsResponse,
  Reactions,
  ReactionsMertResponse,
  UserReactionsResponse,
} from "../types/MertTypes";
import { MyContext } from "../types";
import { toMethPath } from "../constants";
import { extension } from "../utils/fileExtension";
import { getManager, LessThan, ObjectLiteral } from "typeorm";
import validator from "validator";
import { validateImage } from "../utils/validateImage";

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
    @Ctx() { req, redis }: MyContext,
    @PubSub() pubSub: PubSubEngine
  ): Promise<MertCreationResponse> {
    const errors = new MertInput(fields).validate();
    if (errors.length > 0)
      return {
        errors,
        message: "Validation error",
        success: false,
      };
    let mert: Mert;
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
          const isValidPicture = validateImage(fields.picture);
          if (!isValidPicture) throw new Error("Invalid file");
          const imageName = mert.id + extension(picture.filename);

          await new Promise((resolve, reject) =>
            picture
              .createReadStream()
              .pipe(createWriteStream(toMethPath(imageName)))
              .on("finish", () => {
                mert.picture = `${process.env.HOST_SERVER}/merts/${imageName}`;
                resolve(true);
              })
              .on("error", (e) => {
                reject(false);
                throw new Error("Cannot upload the image");
              })
          );
          await mert.save();
        }
        return mert;
      });
    } catch (e) {
      return {
        success: false,
        message: e.message,
      };
    }
    if (!mert)
      return {
        success: false,
        message: "",
      };

    const mertCreated = await Mert.findOne(mert.id, { relations: ["user"] });
    if (mertCreated?.father) {
      await redis.lpush(mertCreated.father.id, JSON.stringify(mertCreated));
    } else {
      await redis.lpush("merts", JSON.stringify(mertCreated));
      await pubSub.publish("MERTS", mertCreated);
    }

    if (!mert) {
      return {
        success: false,
        message: "Sorry we cannot create the mert :(",
      };
    }

    return { mert: mertCreated, success: true };
  }

  @Query(() => Mert, { nullable: true })
  mert(@Arg("mertId", { nullable: true }) mertId: string) {
    if (!mertId) return null;
    return Mert.findOne(mertId, { relations: ["user"] });
  }

  @Query(() => MertsResponse, { nullable: true })
  async merts(
    @Arg("mertId", { nullable: true }) mertId: string,
    @Arg("cursor", { nullable: true }) dateOrUsername: string,
    @Ctx() { redis }: MyContext
  ): Promise<MertsResponse> {
    let conditions;
    // const cachedMerts = await redis.lrange("merts", 0, -1);
    // const merts: Mert[] = cachedMerts.map((m) => JSON.parse(m));
    const isValidDate = new Date(dateOrUsername).toString() === "Invalid Date";

    if (dateOrUsername && !isValidDate) {
      redis.lrange(dateOrUsername, 0, -1);
      conditions = (qy: any) => {
        qy.where(`\"Mert__user\".\"username\"=:username`, {
          username: dateOrUsername,
        });
      };
    } else {
      // pulled from the cache ??

      conditions = {
        fatherId: mertId,
        createdAt: LessThan(
          dateOrUsername
            ? new Date(+dateOrUsername).toISOString()
            : new Date(Date.now()).toISOString()
        ),
      };
    }

    const merts = await Mert.find({
      take: 10,
      where: conditions,
      relations: ["user"],
      order: {
        createdAt: "DESC",
      },
    });

    console.log(merts);
    return {
      merts,
      hasMore: merts.length === 10,
    };
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

  @Subscription(() => Mert, { topics: "MERTS", nullable: true })
  newMert(@Root() mert: Mert): Mert | null {
    return mert ? mert : null;
  }
}
