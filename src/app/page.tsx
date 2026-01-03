import { sql, CategoryWithTasks, Task, Category } from '@/lib/db';
import { CategoryCard } from '@/components/CategoryCard';

// Force dynamic rendering - database connection happens at runtime only
export const dynamic = 'force-dynamic';

// Get day abbreviation
function getDayCode(date: Date): string {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  return days[date.getDay()];
}

// Check if task should show for today
function shouldShowTask(task: Task, dayCode: string): boolean {
  const daysActive = task.days_active.toUpperCase();

  if (daysActive === 'DAILY') return true;
  if (daysActive === dayCode) return true;

  // Handle combined days like 'MWFS' for Mon/Wed/Fri/Sun
  if (daysActive === 'MWFS') {
    return ['MON', 'WED', 'FRI', 'SUN'].includes(dayCode);
  }
  if (daysActive === 'WEEKDAYS') {
    return !['SAT', 'SUN'].includes(dayCode);
  }

  return false;
}

async function getCategoriesWithTasks(date: string, dayCode: string): Promise<CategoryWithTasks[]> {
  // Get all categories
  const categories = await sql`
    SELECT id, name, icon, sort_order 
    FROM categories 
    ORDER BY sort_order
  ` as Category[];

  // Get all active tasks
  const tasks = await sql`
    SELECT id, category_id, name, days_active, sort_order, is_active 
    FROM tasks 
    WHERE is_active = true
    ORDER BY sort_order
  ` as Task[];

  // Get completions for today
  const completions = await sql`
    SELECT task_id 
    FROM completions 
    WHERE completed_date = ${date}
  ` as { task_id: number }[];

  const completedTaskIds = new Set(completions.map(c => c.task_id));

  // Combine into CategoryWithTasks
  return categories.map(category => ({
    ...category,
    tasks: tasks
      .filter(task => task.category_id === category.id && shouldShowTask(task, dayCode))
      .map(task => ({
        ...task,
        completed: completedTaskIds.has(task.id),
      })),
  }));
}

export default async function Home() {
  const today = new Date();
  const dateString = today.toISOString().split('T')[0];
  const dayCode = getDayCode(today);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[today.getDay()];

  const categories = await getCategoriesWithTasks(dateString, dayCode);

  const totalTasks = categories.reduce((sum, cat) => sum + cat.tasks.length, 0);
  const completedTasks = categories.reduce(
    (sum, cat) => sum + cat.tasks.filter(t => t.completed).length,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Daily Goals
          </h1>
          <p className="text-zinc-400 mt-2">
            {dayName}, {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          {/* Overall progress */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="text-2xl font-bold text-emerald-400">{completedTasks}</span>
            <span className="text-zinc-500">/</span>
            <span className="text-xl text-zinc-400">{totalTasks}</span>
            <span className="text-zinc-500 text-sm">completed</span>
          </div>
        </header>

        {/* Categories */}
        <main className="space-y-6">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} date={dateString} />
          ))}
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-zinc-600 text-sm">
          <p>Stay consistent. Trust the process. 💪</p>
        </footer>
      </div>
    </div>
  );
}
