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
  MertsResponse,
  ReactionsMertResponse,
  UserReactionsResponse,
} from "../types/Responses";

import { MyContext } from "../types";
import { toMethPath } from "../constants";
import { extension } from "../utils/fileExtension";
import { getManager, LessThan, ObjectLiteral } from "typeorm";
import validator from "validator";
import { validateImage } from "../utils/validateImage";
import { CreateMertInput } from "../types/Inputs";
import { Reactions } from "../types/Common";
import { saveFile } from "../utils/saveFile";
import { toggleLikes } from "./MertHerlpers/toggleLikes";

@Resolver(Mert)
export class MertsResolver {
  @FieldResolver(() => Mert, { nullable: true })
  async father(@Root() mert: Mert, @Ctx() { mertLoader }: MyContext) {
    return mert.fatherId ? mertLoader.load(mert.fatherId) : null;
  }

  @Authorized()
  @Mutation(() => MertCreationResponse)
  async createMert(
    @Arg("fields") fields: CreateMertInput,
    @Ctx() { req, redis }: MyContext,
    @PubSub() pubSub: PubSubEngine
  ): Promise<MertCreationResponse> {
    const errors = new CreateMertInput(fields).validate();
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
          const isValidPicture = validateImage(fields.picture);
          if (!isValidPicture) throw new Error("Invalid file");
          const { url, success, message } = await saveFile({
            file: fields.picture,
            fileKind: "merts",
            fileName: mert.id,
            saveTo: toMethPath,
          });
          if (!success) throw new Error(message);

          mert.picture = url;
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
        message: "Mert not found",
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
    //TODO: implement caching for merts
    // const cachedMerts = await redis.lrange("merts", 0, -1);
    // const merts: Mert[] = cachedMerts.map((m) => JSON.parse(m));
    // const isValidDate = new Date(dateOrUsername).toString() === "Invalid Date";

    if (dateOrUsername) {
      // redis.lrange(dateOrUsername, 0, -1);
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
    const [likes, dislikes] = toggleLikes({
      dislikes: mert.dislikes,
      likes: mert.likes,
      reaction: reaction,
      userId: req.session.userId,
    });

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

    if (!users) return { success: false, message: "Users not found" };

    const usersReaction = await User.findByIds(Array.from(users));

    return {
      success: true,
      users: usersReaction,
    };
  }

  @Subscription(() => Mert, { topics: "MERTS", nullable: true })
  newMert(@Root() mert: Mert, @Ctx() { req }: MyContext): Mert | null {
    if (!mert || mert.user?.id === req.session.id) {
      return null;
    }
    return mert;
  }
}
