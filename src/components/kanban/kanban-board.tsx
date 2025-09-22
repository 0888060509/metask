"use client";

import React from "react";
import type { Task, TaskStatus } from "@/lib/types";
import { KanbanColumn } from "./kanban-column";

type KanbanBoardProps = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

const columns: { id: TaskStatus; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "inprogress", title: "In Progress" },
  { id: "done", title: "Done" },
];

export function KanbanBoard({ tasks, setTasks }: KanbanBoardProps) {
  const onTaskDrop = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          status={column.id}
          title={column.title}
          tasks={tasks.filter((task) => task.status === column.id)}
          onTaskDrop={onTaskDrop}
        />
      ))}
    </div>
  );
}
