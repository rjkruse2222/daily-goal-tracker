'use server';

import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function toggleTaskCompletion(taskId: number, date: string, completed: boolean) {
    if (completed) {
        // Remove completion
        await sql`
      DELETE FROM completions 
      WHERE task_id = ${taskId} AND completed_date = ${date}
    `;
    } else {
        // Add completion
        await sql`
      INSERT INTO completions (task_id, completed_date) 
      VALUES (${taskId}, ${date})
      ON CONFLICT (task_id, completed_date) DO NOTHING
    `;
    }
    revalidatePath('/');
}

export async function addTask(categoryId: number, name: string, daysActive: string = 'daily') {
    await sql`
    INSERT INTO tasks (category_id, name, days_active, sort_order)
    VALUES (${categoryId}, ${name}, ${daysActive}, 100)
  `;
    revalidatePath('/');
}

export async function deleteTask(taskId: number) {
    await sql`DELETE FROM tasks WHERE id = ${taskId}`;
    revalidatePath('/');
}
