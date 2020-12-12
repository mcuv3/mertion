import { Upload } from "../types";
import { extension } from "../utils/fileExtension";
import path from "path";
import { createWriteStream, unlinkSync, existsSync } from "fs";

enum Folder {
  Mert = "merts",
  ProfilePicture = "profile-pictures",
  Background = "Background",
}

interface FileKind {
  folder: Folder;
}

interface File {
  file: Upload;
  name: string;
  oldName?: string;
}

abstract class FileStorage<T extends FileKind> {
  file: File;
  abstract folder: T["folder"];

  constructor(file: File) {
    this.file = file;
  }

  abstract validate(): void;

  path(filename: string) {
    return path.join(__dirname, "..", "public", this.folder, filename);
  }

  async save(): Promise<string> {
    this.validate();
    const ext = extension(this.file.file.filename);
    this.removeOld();
    await new Promise((resolve) =>
      this.file.file
        .createReadStream()
        .pipe(createWriteStream(this.path(this.file.name + ext)))
        .on("finish", () => resolve(true))
        .on("error", (e) => {
          console.log(e);
          throw new Error("Cannot save the image");
        })
    );

    return `${process.env.HOST_SERVER}/${this.folder}/${this.file.name}${ext}`;
  }

  removeOld() {
    if (this.file.oldName) {
      const path = this.path(this.file.oldName);
      if (existsSync(path)) unlinkSync(path);
    }
  }
}
interface ProfilePictureDest {
  folder: Folder.ProfilePicture;
}
interface MertDest {
  folder: Folder.Mert;
}
interface BackgroundDest {
  folder: Folder.Background;
}

abstract class ImageStorage<T extends FileKind> extends FileStorage<T> {
  validate() {
    const image = this.file.file;
    if (!this.file.file) throw new Error("Image not found.");
    const ext = extension(image.filename || "");
    const isValidExtension =
      ext === ".png" || ext === ".jpg" || ext === ".jpeg";
    if (!isValidExtension) throw new Error("This is not a image.");
  }
}

export class ProfilePictureStorage extends ImageStorage<ProfilePictureDest> {
  readonly folder = Folder.ProfilePicture;
}
export class MertPictureStorage extends ImageStorage<MertDest> {
  readonly folder = Folder.Mert;
}
export class BackgroundPictureStorage extends ImageStorage<BackgroundDest> {
  readonly folder = Folder.Background;
}
