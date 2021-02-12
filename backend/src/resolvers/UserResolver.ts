import { GraphQLUpload } from "graphql-upload";
import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import * as followController from "../controllers/followers";
import { User } from "../entities";
import {
  BackgroundPictureStorage,
  ProfilePictureStorage,
} from "../models/ImageStorage";
import { MyContext, Upload } from "../types";
import { ChangeProfileInput } from "../types/Inputs";
import { UserUpdatedResponse } from "../types/Responses";
import { extension } from "../utils/fileExtension";

@Resolver()
export class UserResolver {
  @Authorized()
  @Mutation(() => UserUpdatedResponse)
  async changeProfile(
    @Arg("fields") fields: ChangeProfileInput,
    @Arg("profile_picture", () => GraphQLUpload, { nullable: true })
    picture: Upload,
    @Arg("bg_picture", () => GraphQLUpload, { nullable: true })
    pictureBg: Upload,
    @Ctx() { req }: MyContext
  ): Promise<UserUpdatedResponse> {
    const errors = new ChangeProfileInput(fields).validate();

    if (errors.length > 0)
      return { errors, message: "Validation errors", success: false };

    try {
      const updates: Partial<User> = {
        username: fields.username,
        name: fields.name,
        about: fields.about,
        age: fields.age,
      };

      if (picture) {
        const url = await new ProfilePictureStorage({
          file: picture,
          name: req.session.username,
          oldName: req.session.username + extension(req.session.picture),
        }).save();
        updates["picture"] = url;
      }

      if (pictureBg) {
        const url = await new BackgroundPictureStorage({
          file: pictureBg,
          name: req.session.username,
          oldName: req.session.username + extension(req.session.bgPicture),
        }).save();
        updates["backgroundPicture"] = url;
      }

      await User.update(req.session.userId, updates);

      return {
        success: true,
        message: "Updated Successfully",
        backgroundImageUrl: updates["backgroundPicture"],
        picture: updates["picture"],
      };
    } catch (e) {
      return {
        success: false,
        message: e.message,
      };
    }
  }

  @Authorized()
  @Mutation(() => Boolean)
  async followUser(
    @Ctx() { req }: MyContext,
    @Arg("toFollowUserId") toFollowUserId: string
  ) {
    await followController.followUser(req.session.user, toFollowUserId);
    return true;
  }
}
