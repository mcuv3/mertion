export const __server__ = typeof window === "undefined";
export const __prod__ = process.env.NODE_ENV == "production";
