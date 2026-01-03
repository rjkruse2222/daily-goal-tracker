import { neon, NeonQueryFunction } from '@neondatabase/serverless';

// Lazy initialization - only connect when actually used at runtime
let _sql: NeonQueryFunction<false, false> | null = null;

function getSQL(): NeonQueryFunction<false, false> {
  if (_sql) return _sql;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set. Add it to your .env.local file or Vercel environment variables.');
  }

  _sql = neon(databaseUrl);
  return _sql;
}

// Proxy that lazily initializes the connection
export const sql = new Proxy({} as NeonQueryFunction<false, false>, {
  apply: (_, __, args) => getSQL()(args[0], ...args.slice(1)),
  get: (_, prop) => {
    if (prop === 'then') return undefined; // Prevent promise detection issues
    const realSql = getSQL();
    const value = realSql[prop as keyof typeof realSql];
    return typeof value === 'function' ? value.bind(realSql) : value;
  },
});

export type Category = {
  id: number;
  name: string;
  icon: string;
  sort_order: number;
};

export type Task = {
  id: number;
  category_id: number;
  name: string;
  days_active: string;
  sort_order: number;
  is_active: boolean;
};

export type TaskWithCompletion = Task & {
  completed: boolean;
};

export type CategoryWithTasks = Category & {
  tasks: TaskWithCompletion[];
};
