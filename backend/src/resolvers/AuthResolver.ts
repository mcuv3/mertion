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
import {
  MeResponse,
  SignUpResponse,
  SingInInput,
  SingUpInput,
} from "../types/AuthTypes";
import { MyContext, Upload } from "../types";
import { createWriteStream } from "fs";
import { GraphQLUpload } from "graphql-upload";
import argon2 from "argon2";
import { toProfilePath } from "../constants";
import { extension } from "../utils/fileExtension";

@Resolver()
export class Auth {
  @Query(() => MeResponse, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) return null;
    const user = await User.findOne(req.session.userId);
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      picture: user.picture,
      name: user.name,
      about: user.about,
      age: user.age,
      backgroundPicture: user.backgroundPicture,
    };
  }

  @Query(() => MeResponse, { nullable: true })
  async user(
    @Arg("username", { nullable: true }) username: string
  ): Promise<MeResponse | null> {
    if (!username) return null;
    const user = await User.findOne({ where: { username } });
    if (!user) return null;
    return {
      email: user.email,
      backgroundPicture: user.backgroundPicture,
      about: user.about,
      name: user.name,
      picture: user.picture,
      username: user.username,
      age: user.age,
    };
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
        success: false,
      };
    }

    const ext = extension(picture?.filename || "");
    const isGoodFile = ext === ".png" || ext === ".jpg" || ext === ".jpeg";

    const hashPassword = await argon2.hash(fields.password);
    await User.create({
      ...fields,
      picture: `${process.env.HOST_SERVER}/profile-pictures/${
        (isGoodFile && fields.username + ext) || "default.png"
      }`,
      password: hashPassword,
    }).save();

    if (picture && isGoodFile) {
      console.log("FILE =>", toProfilePath(fields.username + ext));
      await new Promise<boolean>((resolve, reject) =>
        picture
          .createReadStream()
          .pipe(createWriteStream(toProfilePath(fields.username + ext)))
          .on("finish", () => resolve(true))
          .on("error", (e) => {
            console.log(e);
            reject(false);
          })
      );
    }

    return { success: true };
  }

  @Mutation(() => MeResponse)
  async logIn(
    @Arg("fields") fields: SingInInput,
    @Ctx() { req }: MyContext
  ): Promise<MeResponse> {
    const errors = new SingInInput(fields).validate();
    if (errors.length > 0) {
      return {
        errors,
        message: "Validation errors",
      };
    }
    console.log(fields);
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

    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.picture = user.picture;

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      picture: user.picture,
      success: true,
      age: user.age,
      name: user.name,
      about: user.about,
      backgroundPicture: user.backgroundPicture,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req }: MyContext) {
    req.session.destroy(() => {});
    return true;
  }
}
