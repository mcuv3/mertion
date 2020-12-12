import { Upload } from "../types";
import { extension } from "./fileExtension";

import { createWriteStream, unlinkSync, existsSync } from "fs";

interface SaveResult {
  url?: string;
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
  const ext = extension(file.filename);
  if (oldName) {
    const path = saveTo(oldName);
    if (existsSync(path)) unlinkSync(path);
  }

  await new Promise((resolve) =>
    file
      .createReadStream()
      .pipe(createWriteStream(saveTo(fileName + ext)))
      .on("finish", () => resolve(true))
      .on("error", (e) => {
        throw new Error("Cannot save the image");
      })
  );

  return {
    url: `${process.env.HOST_SERVER}/${fileKind}/${fileName}${ext}`,
  };
};
