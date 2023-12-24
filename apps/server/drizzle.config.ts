import type { Config } from 'drizzle-kit';

export default {
  strict: true,
  driver: 'better-sqlite',
  schema: './src/_schema/*',
  out: './drizzle',
  dbCredentials: {
    url: './store.db',
  },
  verbose: true,
} satisfies Config;
