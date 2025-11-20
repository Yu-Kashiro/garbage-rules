import { drizzle } from "drizzle-orm/libsql/web";
import * as garbageSchema from "./schemas/garbage";
import * as authSchema from "./schemas/auth";
import * as cacheSchema from "./schemas/cache";

export const db = drizzle({
  connection: {
    url: process.env.TURSO_DATABASE_URL!,
    ...(process.env.TURSO_AUTH_TOKEN && {
      authToken: process.env.TURSO_AUTH_TOKEN,
    }),
  },
  schema: {
    ...authSchema,
    ...garbageSchema,
    ...cacheSchema,
  },
});
