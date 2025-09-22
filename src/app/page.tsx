"use client";

import * as React from "react";
import { AppHeader } from "@/components/app-header";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { TaskDialog } from "@/components/kanban/task-dialog";
import { TaskFilters } from "@/components/kanban/task-filters";
import { tasks as initialTasks } from "@/lib/data";
import type { Task, TaskPriority } from "@/lib/types";

export type Filters = {
  projects: string[];
  assignees: string[];
  priorities: TaskPriority[];
};

export default function Home() {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filters, setFilters] = React.useState<Filters>({
    projects: [],
    assignees: [],
    priorities: [],
  });

  const handleCreateTask = (newTask: Omit<Task, "id" | "status">) => {
    const taskWithId: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      status: "todo",
    };
    setTasks((prevTasks) => [...prevTasks, taskWithId]);
  };

  const filteredTasks = React.useMemo(() => {
    return tasks.filter((task) => {
      const searchMatch =
        searchQuery.trim() === "" ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const projectMatch =
        filters.projects.length === 0 ||
        filters.projects.includes(task.projectId);
      const assigneeMatch =
        filters.assignees.length === 0 ||
        (task.assigneeId && filters.assignees.includes(task.assigneeId));
      const priorityMatch =
        filters.priorities.length === 0 ||
        filters.priorities.includes(task.priority);
      return searchMatch && projectMatch && assigneeMatch && priorityMatch;
    });
  }, [tasks, filters, searchQuery]);

  return (
    <div className="flex h-full flex-col">
      <AppHeader 
        onNewTaskClick={() => setIsDialogOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <TaskFilters filters={filters} setFilters={setFilters} />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <KanbanBoard tasks={filteredTasks} setTasks={setTasks} />
      </div>
      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleCreateTask}
      />
    </div>
  );
}
