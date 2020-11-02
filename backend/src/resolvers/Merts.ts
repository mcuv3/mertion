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
import { Mert } from "../entities";
import { ErrorResponse } from "../error/ErrorResponse";
import { MertCreationResponse, MertInput } from "../types/Mert";
import { MyContext } from "../types";
import { IMAGE_MERT } from "../constants";
import { extension } from "../utils/fileExtension";
import { getManager, LessThan } from "typeorm";

@Resolver(Mert)
export class MertsResolver {
  @Authorized()
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
        }).save();

        if (fields.picture) {
          const imagePath = mert.id + extension(fields.picture.filename);
          mert.picture = imagePath;
          mert.save();

          const success = await new Promise<boolean>((resolve, reject) =>
            fields
              .picture!.createReadStream()
              .pipe(createWriteStream(imagePath))
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
  mert(@Arg("mertId") mertId: string) {
    return Mert.findOne(mertId, { relations: ["user"] });
  }

  @Query(() => [Mert], { nullable: true })
  merts(
    @Arg("mertId", { nullable: true }) mertId: string,
    @Arg("cursor", { nullable: true }) date: string
  ): Promise<Mert[]> {
    return Mert.find({
      take: 10,
      where: {
        fatherId: mertId,
        createdAt: LessThan(
          date ? new Date(date) : new Date(Date.now()).toISOString()
        ),
      },
      relations: ["user"],
      order: {
        createdAt: "DESC",
      },
    });
  }
}
