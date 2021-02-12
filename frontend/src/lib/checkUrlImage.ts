import { __server__ } from "../util/constants";

const URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL_PRODUCTION
    : "http://app:4000";

export const checkUrlImage = (
  placeholder: string,
  img?: string
): string | undefined => {
  console.log(URL);
  if (!img && __server__) return URL?.replace("localhost", "app") + placeholder;
  if (!img && !__server__) return URL + placeholder;

  if (__server__) return img?.replace("localhost", "app");

  return img;
};
