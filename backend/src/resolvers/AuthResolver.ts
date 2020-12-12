import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { MeResponse, SignUpResponse } from "../types/Responses";
import { MyContext, Upload } from "../types";
import { GraphQLUpload } from "graphql-upload";
import argon2 from "argon2";
import { toProfilePath } from "../constants";
import { validateImage } from "../utils/validateImage";
import { SingInInput, SingUpInput } from "../types/Inputs";
import { saveFile } from "../utils/saveFile";
import { ProfilePictureStorage } from "../models/ImageStorage";

@Resolver()
export class Auth {
  @Query(() => String)
  hello() {
    return "World";
  }

  @Query(() => MeResponse, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<MeResponse | null> {
    if (!req.session.userId) return null;
    const user = await User.findOne(req.session.userId);
    if (!user) return null;
    Reflect.deleteProperty(user, "password");
    return user;
  }

  @Query(() => User, { nullable: true })
  async user(
    @Arg("username", { nullable: true }) username: string
  ): Promise<Partial<User> | null> {
    if (!username) return null;
    const user = await User.findOne({ where: { username } });
    if (!user) return null;
    return {
      id: user.id,
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
    @Ctx() { db }: MyContext,
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
    const qr = db.createQueryRunner();
    try {
      await qr.startTransaction();

      const existingUser = await User.findOne({
        where: [{ username: fields.username, email: fields.email }],
      });
      if (existingUser) throw new Error("You already have been registered");

      const hashPassword = await argon2.hash(fields.password);

      const user = await User.create({
        ...fields,
        password: hashPassword,
      });

      if (picture) {
        const url = await new ProfilePictureStorage({
          name: fields.username,
          file: picture,
        }).save();
        user.picture = url;
      }

      await qr.manager.save(user);

      await qr.commitTransaction();

      return { success: true };
    } catch (e) {
      await qr.rollbackTransaction();

      return {
        success: false,
        message: e.message,
      };
    } finally {
      qr.release();
    }
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
    req.session.bgPicture = user.backgroundPicture;

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
