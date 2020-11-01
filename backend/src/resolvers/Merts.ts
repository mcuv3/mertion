import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Resolver,
  Root,
} from "type-graphql";
import { createWriteStream } from "fs";
import { Mert } from "../entities";
import { ErrorResponse } from "../error/ErrorResponse";
import { MertInput } from "../mutation_types/Mert";
import { MyContext } from "../types";
import { IMAGE_MERT } from "../constants";
import { extension } from "../utils/fileExtension";
import { getManager } from "typeorm";

@Resolver()
export class MertsResolver {
  @Authorized()
  @FieldResolver()
  async author(@Root() fatherId: string, @Ctx() { mertLoader }: MyContext) {
    return mertLoader.load(fatherId);
  }

  @Authorized()
  @Mutation(() => Mert || ErrorResponse)
  async createMert(
    @Arg("fields") fields: MertInput,
    @Ctx() { req, db }: MyContext
  ): Promise<Mert | ErrorResponse> {
    const errors = new MertInput(fields).validate();
    if (errors.length >= 0)
      return {
        errors,
        message: "Validation error",
        success: false,
      };

    const mert = await getManager().transaction(async (_) => {
      const mert = await _.create(Mert, {
        fatherId: fields.fatherId,
        userId: req.session.userId,
      }).save();

      if (fields.picture) {
        const imagePath = mert.id + extension(fields.picture.filename);

        await new Promise<boolean>((resolve, reject) =>
          fields
            .picture!.createReadStream()
            .pipe(createWriteStream(imagePath))
            .on("finish", () => resolve(true))
            .on("error", (e) => {
              console.log(e);

              reject(false);
            })
        );
      }
      return mert;
    });

    if (!mert) {
      return {
        success: false,
        message: "Sorry we cannot create the mert :(",
      };
    }

    return mert;
  }
}
