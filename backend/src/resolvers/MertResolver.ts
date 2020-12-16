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

import { MyContext, Upload } from "../types";
import { toMertPath } from "../constants";
import { extension } from "../utils/fileExtension";
import { getManager, LessThan, ObjectLiteral } from "typeorm";
import validator from "validator";
import { validateImage } from "../utils/validateImage";
import { CreateMertInput } from "../types/Inputs";
import { Reactions } from "../types/Common";
import { saveFile } from "../utils/saveFile";
import { toggleLikes } from "./MertHerlpers/toggleLikes";
import { storeMertRedis } from "./MertHerlpers/storeRedis";
import { GraphQLUpload } from "graphql-upload";
import { MertPictureStorage } from "../models/ImageStorage";

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
    @Arg("mertPicture", () => GraphQLUpload, { nullable: true })
    mertPicture: Upload,
    @Ctx() { req, redis, db }: MyContext,
    @PubSub() pubSub: PubSubEngine
  ): Promise<MertCreationResponse> {
    const errors = new CreateMertInput(fields).validate();
    if (errors.length > 0)
      return {
        errors,
        message: "Validation error",
        success: false,
      };

    const queryRunner = db.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const mert = await Mert.create({
        mert: fields.mert,
        fatherId: fields.fatherId,
        userId: req.session.userId,
        createdAt: new Date().toISOString(),
        likes: [],
        dislikes: [],
      });

      await queryRunner.manager.save(mert);

      if (mertPicture) {
        const url = await new MertPictureStorage({
          file: mertPicture,
          name: mert.id,
        }).save();
        mert.picture = url;
        await queryRunner.manager.save(mert);
      }

      await queryRunner.commitTransaction();

      const mertCreated = (await Mert.findOne(mert.id, {
        relations: ["user"],
      })) as Mert;

      await storeMertRedis(mertCreated, redis);
      await pubSub.publish("MERTS", mertCreated);

      return { mert: mertCreated, success: true };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      return {
        success: false,
        message: e.message,
      };
    } finally {
      await queryRunner.release();
    }
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

  @Query(() => [Mert])
  async mertsById(@Arg("mertIds", () => [String]) mertIds: string[]) {
    return Mert.findByIds(mertIds, {
      relations: ["user"],
      order: {
        createdAt: "ASC",
      },
    });
  }

  @Subscription(() => Mert, { topics: "MERTS", nullable: true })
  newMert(@Root() mert: Mert): Mert {
    return mert;
  }
}
