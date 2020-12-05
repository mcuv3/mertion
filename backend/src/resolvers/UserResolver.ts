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

    const updates: Partial<User> = {
      username: fields.username,
      name: fields.name,
      about: fields.about,
      age: fields.age,
    };

    if (picture) {
      const isValidImage = validateImage(picture);
      if (!isValidImage) {
        return {
          success: false,
          message: "Invalid image file",
        };
      }

      const { success, message, url } = await saveFile({
        file: picture,
        fileKind: "profile-pictures",
        fileName: req.session.username,
        saveTo: toProfilePath,
        oldName: req.session.username + extension(req.session.picture),
      });

      if (!success)
        return {
          success,
          message,
        };
      updates["picture"] = url;
    }

    if (pictureBg) {
      const isValidImage = validateImage(pictureBg);
      if (!isValidImage) {
        return {
          success: false,
          message: "Invalid image file",
        };
      }
      const { success, message, url } = await saveFile({
        file: pictureBg,
        fileKind: "backgrounds",
        fileName: req.session.username,
        saveTo: toBackgroundsPath,
        oldName: req.session.username + extension(req.session.bgPicture),
      });

      if (!success)
        return {
          success,
          message,
        };
      updates["backgroundPicture"] = url;
    }

    await User.update(req.session.userId, updates);

    return {
      success: true,
      message: "Updated Successfully",
      backgroundImageUrl: updates["backgroundPicture"],
      picture: updates["picture"],
    };
  }
}
