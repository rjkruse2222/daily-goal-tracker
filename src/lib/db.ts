import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const sql = neon(process.env.DATABASE_URL);

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
