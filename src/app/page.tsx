"use client";

import * as React from "react";
import { AppHeader } from "@/components/app-header";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { TaskDialog } from "@/components/kanban/task-dialog";
import { TaskFilters } from "@/components/kanban/task-filters";
import { tasks as initialTasks } from "@/lib/data";
import type { Task } from "@/lib/types";

export default function Home() {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleCreateTask = (newTask: Omit<Task, "id" | "status">) => {
    const taskWithId: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      status: "todo",
    };
    setTasks((prevTasks) => [...prevTasks, taskWithId]);
  };

  return (
    <div className="flex h-full flex-col">
      <AppHeader onNewTaskClick={() => setIsDialogOpen(true)} />
      <TaskFilters />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <KanbanBoard tasks={tasks} setTasks={setTasks} />
      </div>
      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleCreateTask}
      />
    </div>
  );
}
