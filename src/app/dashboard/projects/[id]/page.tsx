

"use client";

import React from "react";
import { AppHeader } from "@/components/app-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tasks, projects } from "@/lib/data";
import { Task, Project } from "@/lib/types";
import { notFound } from 'next/navigation';
import { differenceInBusinessDays, formatDistanceToNow, isAfter, isBefore } from "date-fns";
import { BurndownChart } from "@/components/project/burndown-chart";
import { AlertCircle, CheckCircle, Clock, ListTodo, PlayCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardContext } from "../../layout";


function TaskAgeingCard({ tasks, onTaskClick }: { tasks: Task[], onTaskClick: (task: Task) => void }) {
    const inProgressTasks = tasks
        .filter(t => t.status === 'inprogress')
        .map(t => {
            const inProgressActivity = t.activity?.find(a => a.details.toLowerCase().includes('to in progress'));
            const age = inProgressActivity ? differenceInBusinessDays(new Date(), inProgressActivity.timestamp) : 0;
            return { ...t, age };
        })
        .sort((a, b) => b.age - a.age);
    
    const getAgeColor = (age: number) => {
        if (age > 5) return "text-red-500";
        if (age > 2) return "text-yellow-500";
        return "text-muted-foreground";
    };

    return (
         <Card>
            <CardHeader>
                <CardTitle className="font-headline text-xl">Task Ageing</CardTitle>
            </CardHeader>
            <CardContent>
                {inProgressTasks.length > 0 ? (
                    <div className="space-y-4">
                        {inProgressTasks.slice(0, 5).map(task => (
                            <div key={task.id} className="flex justify-between items-center text-sm">
                                <button onClick={() => onTaskClick(task)} className="hover:underline text-left font-medium truncate pr-4">{task.title}</button>
                                <span className={cn("font-semibold", getAgeColor(task.age))}>{task.age} days</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No tasks are in progress.</p>
                )}
            </CardContent>
        </Card>
    );
}


function DeadlineHealthCard({ tasks, onTaskClick }: { tasks: Task[], onTaskClick: (task: Task) => void }) {
    const now = new Date();
    const fortyEightHoursFromNow = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const overdueTasks = tasks.filter(t => t.deadline && t.status !== 'done' && isBefore(t.deadline, now));
    const upcomingTasks = tasks.filter(t => t.deadline && t.status !== 'done' && isAfter(t.deadline, now) && isBefore(t.deadline, fortyEightHoursFromNow));

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-xl">Deadline Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <h3 className="font-semibold">Overdue Tasks</h3>
                        <span className="ml-auto font-bold text-lg">{overdueTasks.length}</span>
                    </div>
                     <div className="space-y-2 text-sm">
                        {overdueTasks.slice(0, 3).map(task => (
                             <div key={task.id} className="flex justify-between items-center">
                                <button onClick={() => onTaskClick(task)} className="hover:underline text-left truncate pr-4">{task.title}</button>
                                <span className="text-red-500 font-medium">
                                    {formatDistanceToNow(task.deadline!, { addSuffix: true })}
                                </span>
                            </div>
                        ))}
                        {overdueTasks.length > 3 && <p className="text-xs text-muted-foreground text-center pt-1">and {overdueTasks.length - 3} more...</p>}
                    </div>
                </div>
                 <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-yellow-500" />
                        <h3 className="font-semibold">Upcoming Deadlines</h3>
                         <span className="ml-auto font-bold text-lg">{upcomingTasks.length}</span>
                    </div>
                    <div className="space-y-2 text-sm">
                        {upcomingTasks.slice(0, 3).map(task => (
                             <div key={task.id} className="flex justify-between items-center">
                                <button onClick={() => onTaskClick(task)} className="hover:underline text-left truncate pr-4">{task.title}</button>
                                <span className="text-yellow-500 font-medium">
                                     {formatDistanceToNow(task.deadline!, { addSuffix: true })}
                                </span>
                            </div>
                        ))}
                         {upcomingTasks.length > 3 && <p className="text-xs text-muted-foreground text-center pt-1">and {upcomingTasks.length - 3} more...</p>}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function ProjectTabs({ projectId }: { projectId: string }) {
    return (
        <TabsList>
            <TabsTrigger value="dashboard" asChild>
                <Link href={`/dashboard/projects/${projectId}`}>Dashboard</Link>
            </TabsTrigger>
            <TabsTrigger value="tasks" asChild>
                <Link href={`/dashboard/projects/${projectId}/tasks`}>Tasks</Link>
            </TabsTrigger>
        </TabsList>
    );
}


function ProjectDashboardClient({ project, projectTasks }: { project: Project, projectTasks: Task[] }) {
    const context = React.useContext(DashboardContext);
    
    if (!context) return null;
    const { openTask } = context;

    const tasksByStatus = projectTasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
    }, {} as Record<Task['status'], number>);


    return (
        <div className="flex h-full flex-col">
            <AppHeader title={project.name} />
             <div className="border-b px-4 py-2">
                <Tabs value={'dashboard'}>
                    <ProjectTabs projectId={project.id} />
                </Tabs>
            </div>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">To Do</CardTitle>
                             <ListTodo className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{tasksByStatus.todo || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                            <PlayCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{tasksByStatus.inprogress || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Done</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{tasksByStatus.done || 0}</div>
                        </CardContent>
                    </Card>
                </div>
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <BurndownChart projectTasks={projectTasks} />
                    </div>
                    <div className="space-y-6">
                       <TaskAgeingCard tasks={projectTasks} onTaskClick={openTask} />
                       <DeadlineHealthCard tasks={projectTasks} onTaskClick={openTask} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// This is the new Server Component wrapper
export default function ProjectDashboardPage({ params }: { params: { id: string } }) {
    const project = projects.find(p => p.id === params.id);
    if (!project) {
        notFound();
    }
    const projectTasks = tasks.filter(t => t.projectId === params.id);
    
    return <ProjectDashboardClient project={project} projectTasks={projectTasks} />;
}
