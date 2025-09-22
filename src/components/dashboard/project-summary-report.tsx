
"use client"

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { isBefore } from 'date-fns';
import type { Project, Task } from '@/lib/types';
import { iconMap } from '../project/icon-picker';
import { cn } from '@/lib/utils';

type ProjectSummaryProps = {
    projects: Project[];
    tasks: Task[];
};

export function ProjectSummaryReport({ projects, tasks }: ProjectSummaryProps) {

    const projectMetrics = React.useMemo(() => {
        return projects.map(project => {
            const projectTasks = tasks.filter(task => task.projectId === project.id);
            const totalTasks = projectTasks.length;
            const completedTasks = projectTasks.filter(task => task.status === 'done').length;
            const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
            const overdueTasks = projectTasks.filter(task => task.deadline && task.status !== 'done' && isBefore(task.deadline, new Date())).length;
            
            return {
                ...project,
                totalTasks,
                completedTasks,
                progress: Math.round(progress),
                overdueTasks,
            };
        });
    }, [projects, tasks]);

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead className="w-[200px]">Progress</TableHead>
                        <TableHead className="text-center">Tasks (Done/Total)</TableHead>
                        <TableHead className="text-center">Overdue</TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projectMetrics.map(project => {
                         const Icon = iconMap[project.icon as keyof typeof iconMap] || iconMap.FileText;
                        return (
                            <TableRow key={project.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Icon className="h-5 w-5 text-muted-foreground" />
                                        <span className="font-medium">{project.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold w-12 text-right">{project.progress}%</span>
                                        <Progress value={project.progress} className="h-2" />
                                    </div>
                                </TableCell>
                                <TableCell className="text-center font-medium">
                                    {project.completedTasks}/{project.totalTasks}
                                </TableCell>
                                <TableCell className={cn("text-center font-bold", project.overdueTasks > 0 ? "text-red-500" : "text-muted-foreground")}>
                                    {project.overdueTasks}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/dashboard/projects/${project.id}`}>
                                            Dashboard
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
