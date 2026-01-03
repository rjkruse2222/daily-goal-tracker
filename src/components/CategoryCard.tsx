'use client';

import { CategoryWithTasks } from '@/lib/db';
import { TaskItem } from './TaskItem';
import { useState } from 'react';

type CategoryCardProps = {
    category: CategoryWithTasks;
    date: string;
};

export function CategoryCard({ category, date }: CategoryCardProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const completedCount = category.tasks.filter(t => t.completed).length;
    const totalCount = category.tasks.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <div className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl border border-zinc-800 overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <h2 className="text-xl font-semibold text-zinc-100">{category.name}</h2>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-zinc-400">
                        {completedCount}/{totalCount}
                    </span>
                    <div className="w-24 h-2 bg-zinc-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <svg
                        className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {isExpanded && (
                <div className="px-4 pb-4 space-y-2">
                    {category.tasks.length === 0 ? (
                        <p className="text-zinc-500 text-center py-4">No tasks for today</p>
                    ) : (
                        category.tasks.map(task => (
                            <TaskItem key={task.id} task={task} date={date} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
