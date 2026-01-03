'use client';

import { toggleTaskCompletion } from '@/app/actions';
import { TaskWithCompletion } from '@/lib/db';
import { useTransition } from 'react';

type TaskItemProps = {
    task: TaskWithCompletion;
    date: string;
};

export function TaskItem({ task, date }: TaskItemProps) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(() => {
            toggleTaskCompletion(task.id, date, task.completed);
        });
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={`
        w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200
        ${task.completed
                    ? 'bg-emerald-500/20 border border-emerald-500/30'
                    : 'bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-700/50'
                }
        ${isPending ? 'opacity-50' : ''}
      `}
        >
            <div className={`
        w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
        ${task.completed
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-zinc-500'
                }
      `}>
                {task.completed && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
            <span className={`text-left flex-1 ${task.completed ? 'text-zinc-400 line-through' : 'text-zinc-100'}`}>
                {task.name}
            </span>
        </button>
    );
}
