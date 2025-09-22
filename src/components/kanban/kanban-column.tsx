"use client";

import type { Task, TaskStatus, Project } from "@/lib/types";
import { TaskCard } from "./task-card";
import React from "react";
import { cn } from "@/lib/utils";

type KanbanColumnProps = {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onTaskDrop: (taskId: string, newStatus: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
  projects: Project[];
};

export function KanbanColumn({ title, status, tasks, onTaskDrop, onTaskClick, projects }: KanbanColumnProps) {
  const [isOver, setIsOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    const taskId = e.dataTransfer.getData("text/plain");
    onTaskDrop(taskId, status);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex flex-col rounded-lg transition-colors",
        isOver && "bg-primary/10"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b bg-muted/50 rounded-t-lg">
        <h2 className="font-headline text-lg font-bold">{title}</h2>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
          {tasks.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4">
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onTaskClick={onTaskClick}
            project={projects.find((p) => p.id === task.projectId)} 
          />
        ))}
        {tasks.length === 0 && (
            <div className="flex h-32 items-center justify-center rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">No tasks yet.</p>
            </div>
        )}
      </div>
    </div>
  );
}
