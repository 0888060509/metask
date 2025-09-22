"use client";

import * as React from "react";
import { AppHeader } from "@/components/app-header";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { TaskDialog } from "@/components/kanban/task-dialog";
import { TaskDetailDialog } from "@/components/kanban/task-detail-dialog";
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
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = React.useState(false);
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
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
  
  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prevTasks) => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setSelectedTask(updatedTask);
  }

  const handleOpenTask = (task: Task) => {
    setSelectedTask(task);
  };
  
  const handleCloseDetailDialog = () => {
    setSelectedTask(null);
  };
  
  const handleOpenEditDialog = () => {
    setIsEditTaskDialogOpen(true);
  }

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
        onNewTaskClick={() => setIsNewTaskDialogOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <TaskFilters filters={filters} setFilters={setFilters} />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <KanbanBoard tasks={filteredTasks} setTasks={setTasks} onTaskClick={handleOpenTask} />
      </div>
      <TaskDialog
        open={isNewTaskDialogOpen}
        onOpenChange={setIsNewTaskDialogOpen}
        onSave={handleCreateTask}
      />
      <TaskDialog
        open={isEditTaskDialogOpen}
        onOpenChange={setIsEditTaskDialogOpen}
        onSave={(updatedTask) => handleUpdateTask({...selectedTask, ...updatedTask} as Task)}
        task={selectedTask ?? undefined}
      />
       <TaskDetailDialog 
        task={selectedTask} 
        onOpenChange={handleCloseDetailDialog}
        onEdit={handleOpenEditDialog}
      />
    </div>
  );
}
