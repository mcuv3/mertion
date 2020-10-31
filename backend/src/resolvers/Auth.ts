import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { User } from "../entities/User";
import { ErrorResponse } from "../error/ErrorResponse";
import {
  MeResponse,
  SignUpResponse,
  SingInInput,
  SingUpInput,
} from "../mutation_types/Auth";
import { MyContext, Upload } from "../types";
import { createWriteStream } from "fs";
import path from "path";
import { GraphQLUpload } from "graphql-upload";
import argon2 from "argon2";
import { IMAGE_PROFILE } from "../constants";
import { extension } from "../utils/fileExtension";

@Resolver()
export class Auth {
  @Query(() => MeResponse, { nullable: true })
  me(@Ctx() { req }: MyContext): MeResponse | null {
    if (!req.session.user) return null;
    return req.session.user;
  }

  @Mutation(() => SignUpResponse)
  async signUp(
    @Arg("fields") fields: SingUpInput,
    @Arg("profile_picture", () => GraphQLUpload, { nullable: true })
    picture: Upload
  ): Promise<SignUpResponse> {
    const errors = new SingUpInput(fields).validate();
    if (errors.length > 0) {
      return {
        message: "Bad inputs",
        errors,
        success: false,
      };
    }

    const existingUser = await User.findOne({
      where: [{ username: fields.username, email: fields.email }],
    });

    if (existingUser) {
      return {
        message: "You already have been registered",
      };
    }

    const ext = extension(picture.filename);
    const isGoodFile = ext === ".png" || ext === ".jpg" || ext === ".jpeg";

    const hashPassword = await argon2.hash(fields.password);
    await User.create({
      ...fields,
      picture: `http://localhost:4000/profile-pictures/${
        (isGoodFile && fields.username + ext) || "default.png"
      }`,
      password: hashPassword,
    }).save();

    if (picture && isGoodFile) {
      await new Promise<boolean>((resolve, reject) =>
        picture
          .createReadStream()
          .pipe(createWriteStream(IMAGE_PROFILE(fields.username + ext)))
          .on("finish", () => resolve(true))
          .on("error", (e) => {
            console.log(e);
            reject(false);
          })
      );
    }

    return { success: true };
  }

  @Mutation(() => ErrorResponse || Boolean)
  async logIn(
    @Arg("fields") fields: SingInInput,
    @Ctx() { req }: MyContext
  ): Promise<ErrorResponse | boolean> {
    const errors = new SingInInput(fields).validate();
    if (errors.length > 0) {
      return {
        errors,
        message: "Validation errors",
      };
    }

    const user = await User.findOne({ where: { email: fields.email } });
    if (!user)
      return {
        message: "No user found",
        success: false,
      };

    const password = await argon2.verify(user.password, fields.password);
    if (!password)
      return {
        message: "Invalid credentials",
        success: false,
      };

    req.session.user = user;

    return { success: true };
  }
}
