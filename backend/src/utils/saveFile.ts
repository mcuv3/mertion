import { toProfilePath } from "../constants";
import { Upload, UserCookie } from "../types";
import { extension } from "./fileExtension";
import { Request } from "express";
import { createWriteStream, unlinkSync, existsSync } from "fs";

interface SaveResult {
  success: boolean;
  url?: string;
  message?: string;
}

export const saveFile = async (
  file: Upload,
  user: any,
  sendTo: (_: string) => string,
  folder: string
): Promise<SaveResult> => {
  const ext = extension(file?.filename || "");
  const isGoodFile = ext === ".png" || ext === ".jpg" || ext === ".jpeg";

  try {
    if (isGoodFile) {
      const path = sendTo(user.username + ".jpg");
      if (existsSync(path)) unlinkSync(path);

      const success = await new Promise<boolean>((resolve, reject) =>
        file
          .createReadStream()
          .pipe(createWriteStream(sendTo(user.username + ext)))
          .on("finish", () => resolve(true))
          .on("error", (e) => {
            console.log(e);
            reject(false);
          })
      );
      if (!success) throw new Error("Cannot save the image.");

      return {
        success,
        url: `${process.env.HOST_SERVER}/${folder}/${user.username}${ext}`,
      };
    } else {
      return {
        success: false,
        message: "Invalid file",
      };
    }
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: e.message || "Something went wring trying to upload the image.",
    };
  }
};
