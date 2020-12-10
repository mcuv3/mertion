import { Upload } from "../types";
import { extension } from "./fileExtension";

export const validateImage = async (image: Upload) => {
  await image;

  if (!image) return Promise.resolve(false);
  const ext = extension(image?.filename || "");
  const isValidExtension = ext === ".png" || ext === ".jpg" || ext === ".jpeg";
  return Promise.resolve(isValidExtension);
};
