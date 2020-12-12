import { Upload } from "../types";
import { extension } from "./fileExtension";
import fs from "fs";

export const validateImage = async (image: Upload) => {
  if (!image) throw new Error("Image not found.");
  const ext = extension(image.filename || "");
  const isValidExtension = ext === ".png" || ext === ".jpg" || ext === ".jpeg";
  if (!isValidExtension) throw new Error("This is not a image.");
};
