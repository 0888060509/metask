
"use client";

import * as React from "react";
import { notFound, usePathname } from "next/navigation";
import Link from 'next/link';

import { AppHeader } from "@/components/app-header";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { TaskDialog } from "@/components/kanban/task-dialog";
import { TaskDetailDialog } from "@/components/kanban/task-detail-dialog";
import { KanbanToolbar } from "@/components/kanban/kanban-toolbar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProjectDialog } from "@/components/project/project-dialog";
import { tasks as initialTasks, projects as initialProjects, tags as initialTags, notifications as initialNotifications } from "@/lib/data";
import type { Task, TaskPriority, Project, Comment, Tag, Notification } from "@/lib/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type Filters = {
  assignees: string[];
  priorities: TaskPriority[];
  tags: string[];
};

function ProjectTabs({ projectId }: { projectId: string }) {
    const pathname = usePathname();
    const isDashboard = !pathname.endsWith('/tasks');

    return (
        <div className="px-4 md:px-6">
            <Tabs value={isDashboard ? 'dashboard' : 'tasks'} className="w-full">
                <TabsList>
                    <TabsTrigger value="dashboard" asChild>
                        <Link href={`/dashboard/projects/${projectId}`}>Dashboard</Link>
                    </TabsTrigger>
                    <TabsTrigger value="tasks" asChild>
                        <Link href={`/dashboard/projects/${projectId}/tasks`}>Tasks</Link>
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    );
}


export default function ProjectTasksPage({ params }: { params: { id: string } }) {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [projects, setProjects] = React.useState<Project[]>(initialProjects);
  const [tags, setTags] = React.useState<Tag[]>(initialTags);

  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [filters, setFilters] = React.useState<Omit<Filters, 'projects'>>({
    assignees: [],
    priorities: [],
  });

  const project = projects.find(p => p.id === params.id);
  if (!project) {
    notFound();
  }

  // Task handlers
  const handleCreateTask = (newTask: Omit<Task, "id" | "status" | "comments" | "activity">) => {
    const taskWithId: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      status: "todo",
      comments: [],
      activity: [
        { id: `act-${Date.now()}`, userId: 'user-1', activityType: 'create', timestamp: new Date(), details: 'You created the task.' }
      ],
    };
    setTasks((prevTasks) => [...prevTasks, taskWithId]);
  };
  
  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prevTasks) => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setSelectedTask(updatedTask);
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setSelectedTask(null);
  }

  const handleOpenTask = (task: Task) => {
    setSelectedTask(task);
  };
  
  const handleCloseDetailDialog = () => {
    setSelectedTask(null);
  };

  const handleAddComment = (taskId: string, commentText: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      taskId,
      userId: "user-1", // Mocking current user
      text: commentText,
      createdAt: new Date(),
    };

    setTasks(prevTasks => {
      const newTasks = prevTasks.map(task => {
        if (task.id === taskId) {
          const updatedTask = {
            ...task,
            comments: [...(task.comments || []), newComment]
          };
          if(selectedTask?.id === taskId) {
            setSelectedTask(updatedTask);
          }
          return updatedTask;
        }
        return task;
      });
      return newTasks;
    });
  };

  const filteredTasks = React.useMemo(() => {
    return tasks.filter((task) => {
      if (task.projectId !== params.id) return false;

      const searchMatch =
        searchQuery.trim() === "" ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const assigneeMatch =
        filters.assignees.length === 0 ||
        (task.assigneeIds && task.assigneeIds.some(id => filters.assignees.includes(id)));
      const priorityMatch =
        filters.priorities.length === 0 ||
        filters.priorities.includes(task.priority);
      return searchMatch && assigneeMatch && priorityMatch;
    });
  }, [tasks, filters, searchQuery, params.id]);

  return (
    <div className="flex h-full flex-col">
      <AppHeader 
        title={project.name}
      />
      <ProjectTabs projectId={project.id} />
      <KanbanToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={{...filters, projects: []}}
        setFilters={(newFilters) => {
            const {projects, ...rest} = newFilters;
            setFilters(rest);
        }}
        projects={[]}
        showProjectFilter={false}
      />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <KanbanBoard 
          tasks={filteredTasks} 
          setTasks={setTasks} 
          onTaskClick={handleOpenTask}
          projects={projects}
          onNewTaskClick={() => setIsNewTaskDialogOpen(true)}
        />
      </div>
      <TaskDialog
        open={isNewTaskDialogOpen}
        onOpenChange={setIsNewTaskDialogOpen}
        onSave={handleCreateTask}
        projects={projects}
        tags={tags}
        defaultProjectId={project.id}
      />
     <TaskDetailDialog 
        task={selectedTask}
        projects={projects}
        tags={tags}
        onOpenChange={(isOpen) => {
            if (!isOpen) {
                handleCloseDetailDialog();
            }
        }}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        onComment={handleAddComment}
      />
    </div>
  );
}

