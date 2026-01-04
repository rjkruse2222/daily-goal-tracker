import { neon } from '@neondatabase/serverless';

// Get database connection - initialized on first use
export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set. Add it to your .env.local file or Vercel environment variables.');
  }
  return neon(databaseUrl);
}

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
