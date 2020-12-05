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

export const saveFile = async ({
  file,
  fileKind,
  saveTo,
  fileName,
  oldName,
}: {
  oldName?: string;
  file: Upload;
  fileName: any;
  saveTo: (_: string) => string;
  fileKind: string;
}): Promise<SaveResult> => {
  try {
    const ext = extension(file.filename);
    if (oldName) {
      const path = saveTo(oldName);
      if (existsSync(path)) unlinkSync(path);
    }

    await new Promise(() =>
      file
        .createReadStream()
        .pipe(createWriteStream(saveTo(fileName + ext)))
        .on("error", (e) => {
          throw new Error("Cannot save the image");
        })
    );

    return {
      success: true,
      url: `${process.env.HOST_SERVER}/${fileKind}/${fileName}${ext}`,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: e.message || "Something went wring trying to upload the image.",
    };
  }
};
