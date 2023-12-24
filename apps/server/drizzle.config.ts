import type { Config } from 'drizzle-kit';

export default {
  strict: true,
  driver: 'better-sqlite',
  schema: './src/_schema/*',
  dbCredentials: {
    url: './store.db',
  },
  verbose: true,
} satisfies Config;
