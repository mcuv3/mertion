import { GraphQLUpload } from "graphql-upload";
import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { toBackgroundsPath, toProfilePath } from "../constants";
import { User } from "../entities";
import { StandardResponse } from "../error/StandardResponse";
import { MyContext, Upload } from "../types";
import { ChangeProfileInput } from "../types/UserTypes";
import { saveFile } from "../utils/saveFile";

@Resolver()
export class UserResolver {
  @Authorized()
  @Mutation(() => StandardResponse)
  async changeProfile(
    @Arg("fields") fields: ChangeProfileInput,
    @Arg("profile_picture", () => GraphQLUpload, { nullable: true })
    picture: Upload,
    @Arg("bg_picture", () => GraphQLUpload, { nullable: true })
    pictureBg: Upload,
    @Ctx() { req }: MyContext
  ): Promise<StandardResponse> {
    const errors = new ChangeProfileInput(fields).validate();

    if (errors.length > 0)
      return { errors, message: "Validation errors", success: false };

    const updates: Partial<User> = {
      username: fields.username,
      name: fields.name,
      about: fields.about,
      age: fields.age,
    };
    let messageResponse: string | undefined;

    if (picture) {
      const { success, message, url } = await saveFile(
        picture,
        req.session,
        toProfilePath,
        "profile-pictures"
      );
      if (!success)
        return {
          success,
          message,
        };
      updates["picture"] = url;
    }

    if (pictureBg) {
      const { success, message, url } = await saveFile(
        pictureBg,
        req.session,
        toBackgroundsPath,
        "backgrounds"
      );
      console.log(success, message, url);
      if (!success) messageResponse = message;
      updates["backgroundPicture"] = url;
    }

    await User.update(req.session.userId, updates);

    return {
      success: true,
      message: messageResponse || "Updated Successfully",
    };
  }
}
