

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
import { tasks as initialTasks, projects as allProjects, tags as initialTags } from "@/lib/data";
import type { Task, TaskPriority, Project, Comment, Tag, Notification } from "@/lib/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardContext } from "../../../layout";

export type Filters = {
  assignees: string[];
  priorities: TaskPriority[];
  tags: string[];
};

function ProjectTabs({ projectId }: { projectId: string }) {
    const pathname = usePathname();
    const isDashboard = !pathname.endsWith('/tasks');

    return (
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
    );
}

function ProjectTasksClient({ params }: { params: { id: string } }) {
  const project = allProjects.find(p => p.id === params.id);
    
  if (!project) {
      notFound();
  }

  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [projects, setProjects] = React.useState<Project[]>(allProjects);
  const [tags, setTags] = React.useState<Tag[]>(initialTags);

  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [filters, setFilters] = React.useState<Omit<Filters, 'projects'>>({
    assignees: [],
    priorities: [],
    tags: [],
  });
  
  const currentUserId = "user-1"; // Changed for testing mentions
  const dashboardContext = React.useContext(DashboardContext);

  // Task handlers
  const handleCreateTask = (newTask: Omit<Task, "id" | "status" | "comments" | "activity">) => {
    const taskWithId: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      status: "todo",
      comments: [],
      activity: [
        { id: `act-${Date.now()}`, userId: currentUserId, activityType: 'create', timestamp: new Date(), details: 'You created the task.' }
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

  const handleAddComment = (taskId: string, commentText: string, parentId?: string | null) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      taskId,
      userId: currentUserId,
      text: commentText,
      createdAt: new Date(),
      parentId,
      reactions: []
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

    // Handle mentions
    const mentions = commentText.match(/@(\w+\s\w+)/g) || [];
    if (mentions.length > 0 && dashboardContext) {
      const { addNotification, users } = dashboardContext;
      mentions.forEach(mention => {
        const userName = mention.substring(1);
        const mentionedUser = users.find(u => u.name === userName);
        if (mentionedUser && mentionedUser.id !== currentUserId) {
          addNotification({
            userId: mentionedUser.id,
            actorId: currentUserId,
            type: 'mention',
            taskId: taskId,
            details: { commentId: newComment.id }
          });
        }
      });
    }
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
      const tagMatch =
        filters.tags.length === 0 ||
        (task.tagIds && task.tagIds.some(id => filters.tags.includes(id)));
      return searchMatch && assigneeMatch && priorityMatch && tagMatch;
    });
  }, [tasks, filters, searchQuery, params.id]);

  return (
    <div className="flex h-full flex-col">
      <AppHeader 
        title={project.name}
      >
        <ProjectTabs projectId={project.id} />
      </AppHeader>
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

// This is the new Server Component wrapper
export default function ProjectTasksPage({ params }: { params: { id: string } }) {
    return <ProjectTasksClient params={params} />;
}
