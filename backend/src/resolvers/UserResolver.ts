import { GraphQLUpload } from "graphql-upload";
import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { toBackgroundsPath, toProfilePath } from "../constants";
import { User } from "../entities";
import { MyContext, Upload } from "../types";
import { ChangeProfileInput } from "../types/Inputs";
import { saveFile } from "../utils/saveFile";
import { UserUpdatedResponse } from "../types/Responses";
import { validateImage } from "../utils/validateImage";
import { extension } from "../utils/fileExtension";
import {
  BackgroundPictureStorage,
  ProfilePictureStorage,
} from "../models/ImageStorage";

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
}
