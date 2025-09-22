
"use client"

import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import type { User, Task } from '@/lib/types';
import { ChartTooltip, ChartTooltipContent } from '../ui/chart';

type WorkloadChartProps = {
    users: User[];
    tasks: Task[];
};

const chartConfig = {
    todo: { label: 'To Do', color: 'hsl(var(--chart-1))' },
    inprogress: { label: 'In Progress', color: 'hsl(var(--chart-2))' },
};

export function WorkloadDistributionChart({ users, tasks }: WorkloadChartProps) {
    const workloadData = React.useMemo(() => {
        const data = users.map(user => {
            const userTasks = tasks.filter(task => task.assigneeIds?.includes(user.id));
            const todo = userTasks.filter(task => task.status === 'todo').length;
            const inprogress = userTasks.filter(task => task.status === 'inprogress').length;
            return {
                name: user.name,
                todo: todo,
                inprogress: inprogress,
                total: todo + inprogress,
            };
        });
        return data;
    }, [users, tasks]);

    const averageWorkload = React.useMemo(() => {
        if (workloadData.length === 0) return 0;
        const totalTasks = workloadData.reduce((acc, user) => acc + user.total, 0);
        return totalTasks / workloadData.length;
    }, [workloadData]);

    const workloadThreshold = averageWorkload * 1.5; // Warning if 50% above average

    return (
        <div className="h-[350px] w-full">
            <ResponsiveContainer>
                <BarChart data={workloadData}>
                    <CartesianGrid vertical={false} />
                    <XAxis 
                        dataKey="name" 
                        tickLine={false} 
                        axisLine={false} 
                        tickMargin={8}
                        className="text-xs"
                    />
                    <YAxis 
                        tickLine={false} 
                        axisLine={false} 
                        tickMargin={8} 
                        allowDecimals={false}
                        label={{ value: 'Number of Tasks', angle: -90, position: 'insideLeft', offset: -10, style: { textAnchor: 'middle' } }}
                    />
                    <Tooltip
                        content={<ChartTooltipContent indicator="dot" />}
                        cursor={{fill: 'hsl(var(--muted))'}}
                    />
                    <Legend />
                    <Bar dataKey="todo" stackId="a" fill="var(--color-todo)" radius={[4, 4, 0, 0]}>
                         {workloadData.map((entry, index) => (
                            <Cell key={`cell-todo-${index}`} fill={entry.total > workloadThreshold ? 'hsl(var(--destructive))' : 'hsl(var(--chart-1))'} opacity={0.6}/>
                        ))}
                    </Bar>
                    <Bar dataKey="inprogress" stackId="a" fill="var(--color-inprogress)" radius={[4, 4, 0, 0]}>
                        {workloadData.map((entry, index) => (
                            <Cell key={`cell-inprogress-${index}`} fill={entry.total > workloadThreshold ? 'hsl(var(--destructive))' : 'hsl(var(--chart-2))'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
