declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    REDIS_URL: string;
    PORT: string;
    SESSION_SECRET: string;
    ORIGIN: string;
  }
}

declare namespace Express {
  export interface Request {
    isAuth: boolean;
    user: {
      email: string;
      role: string;
    };
  }
}
