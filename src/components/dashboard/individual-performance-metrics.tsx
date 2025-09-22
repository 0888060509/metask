
"use client"

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { subDays, differenceInDays, isBefore } from 'date-fns';
import type { User, Task } from '@/lib/types';
import { Progress } from '../ui/progress';

type PerformanceMetricsProps = {
    users: User[];
    tasks: Task[];
};

type PerformanceData = {
    userId: string;
    onTimeRate: number;
    avgCycleTime: number | null; // in days
    throughput: number;
};

export function IndividualPerformanceMetrics({ users, tasks }: PerformanceMetricsProps) {
    const [timeRange, setTimeRange] = React.useState('7'); // '7' or '30' days

    const performanceData = React.useMemo(() => {
        const sinceDate = subDays(new Date(), parseInt(timeRange));
        
        return users.map(user => {
            const userTasks = tasks.filter(task => 
                task.assigneeIds?.includes(user.id) && 
                task.status === 'done'
            );

            const completedTasksInDateRange = userTasks.filter(task => {
                const completionActivity = task.activity?.slice().reverse().find(a => a.activityType === 'status_change' && a.details.toLowerCase().includes('to done'));
                return completionActivity && completionActivity.timestamp >= sinceDate;
            });

            const tasksWithDeadlines = completedTasksInDateRange.filter(t => t.deadline);
            const onTimeTasks = tasksWithDeadlines.filter(t => {
                 const completionActivity = t.activity?.slice().reverse().find(a => a.activityType === 'status_change' && a.details.toLowerCase().includes('to done'));
                 return completionActivity && isBefore(completionActivity.timestamp, t.deadline!);
            });

            const onTimeRate = tasksWithDeadlines.length > 0 ? (onTimeTasks.length / tasksWithDeadlines.length) * 100 : 100;
            
            let totalCycleTime = 0;
            let tasksWithCycleTime = 0;

            completedTasksInDateRange.forEach(task => {
                const doneActivity = task.activity?.slice().reverse().find(a => a.activityType === 'status_change' && a.details.toLowerCase().includes('to done'));
                const inProgressActivity = task.activity?.find(a => a.details.toLowerCase().includes('to in progress'));

                if(doneActivity && inProgressActivity) {
                    const cycleTime = differenceInDays(doneActivity.timestamp, inProgressActivity.timestamp);
                    if(cycleTime >= 0) {
                        totalCycleTime += cycleTime;
                        tasksWithCycleTime++;
                    }
                }
            });

            const avgCycleTime = tasksWithCycleTime > 0 ? totalCycleTime / tasksWithCycleTime : null;

            return {
                userId: user.id,
                onTimeRate: Math.round(onTimeRate),
                avgCycleTime: avgCycleTime !== null ? parseFloat(avgCycleTime.toFixed(1)) : null,
                throughput: completedTasksInDateRange.length,
            };
        });

    }, [users, tasks, timeRange]);

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7">Last 7 days</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Team Member</TableHead>
                            <TableHead className="text-center">On-Time Completion</TableHead>
                            <TableHead className="text-center">Avg. Cycle Time (Days)</TableHead>
                            <TableHead className="text-center">Throughput</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => {
                            const data = performanceData.find(d => d.userId === user.id);
                            return (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait"/>
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{user.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                       <div className="flex items-center justify-center gap-2">
                                            <span className="font-semibold w-10">{data?.onTimeRate ?? 0}%</span>
                                            <Progress value={data?.onTimeRate ?? 0} className="w-24 h-2"/>
                                       </div>
                                    </TableCell>
                                    <TableCell className="text-center font-medium">
                                        {data?.avgCycleTime !== null ? `${data?.avgCycleTime}` : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-center font-medium">{data?.throughput ?? 0}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

