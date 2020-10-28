export const DATABASE_URL = process.env.DATABASE_URL;
export const REDIS_URL = process.env.REDIS_URL;
export const ORIGIN = process.env.ORGIN;
export const COOKIE_NAME = "mv3";
export const __prod__ = process.env.NODE_ENV === "production";
export const SESSION_SECRET = process.env.SESSION_SECRET as string;
export const PORT = +process.env.PORT!;
