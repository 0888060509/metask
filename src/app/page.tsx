

"use client";

import * as React from "react";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { TaskDialog } from "@/components/kanban/task-dialog";
import { TaskDetailDialog } from "@/components/kanban/task-detail-dialog";
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
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { KanbanToolbar } from "@/components/kanban/kanban-toolbar";

export type Filters = {
  projects: string[];
  assignees: string[];
  priorities: TaskPriority[];
};

export default function Home() {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [projects, setProjects] = React.useState<Project[]>(initialProjects);
  const [tags, setTags] = React.useState<Tag[]>(initialTags);
  const [notifications, setNotifications] = React.useState<Notification[]>(initialNotifications);

  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = React.useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = React.useState<Project | null>(null);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [filters, setFilters] = React.useState<Filters>({
    projects: [],
    assignees: [],
    priorities: [],
  });
  
  // This would be the ID of the currently logged-in user.
  const currentUserId = "user-4";
  const unreadCount = notifications.filter(n => n.userId === currentUserId && !n.isRead).length;

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
  
  // Project handlers
  const handleCreateProject = () => {
    setSelectedProject(null);
    setIsProjectDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsProjectDialogOpen(true);
  };
  
  const handleSaveProject = (projectData: { name: string; icon: string }) => {
    if (selectedProject) {
      // Update existing project
      setProjects(projects.map(p => p.id === selectedProject.id ? { ...p, ...projectData } : p));
    } else {
      // Create new project
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        name: projectData.name,
        icon: projectData.icon,
      };
      setProjects([...projects, newProject]);
    }
  };
  
  const confirmDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteProject = () => {
    if (projectToDelete) {
      setProjects(projects.filter(p => p.id !== projectToDelete.id));
      // Also delete tasks associated with the project
      setTasks(tasks.filter(t => t.projectId !== projectToDelete.id));
      setProjectToDelete(null);
      setIsDeleteDialogOpen(false);
    }
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
      const searchMatch =
        searchQuery.trim() === "" ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const projectMatch =
        filters.projects.length === 0 ||
        filters.projects.includes(task.projectId);
      const assigneeMatch =
        filters.assignees.length === 0 ||
        (task.assigneeIds && task.assigneeIds.some(id => filters.assignees.includes(id)));
      const priorityMatch =
        filters.priorities.length === 0 ||
        filters.priorities.includes(task.priority);
      return searchMatch && projectMatch && assigneeMatch && priorityMatch;
    });
  }, [tasks, filters, searchQuery]);

  return (
    <SidebarProvider>
      <AppSidebar
        projects={projects}
        onNewProjectClick={handleCreateProject}
        onEditProject={handleEditProject}
        onDeleteProject={confirmDeleteProject}
        unreadNotificationCount={unreadCount}
      />
      <SidebarInset>
        <div className="flex h-full flex-col">
          <AppHeader 
            title="All Tasks"
          />
          <KanbanToolbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filters={filters}
            setFilters={setFilters}
            projects={projects}
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
          <ProjectDialog 
            open={isProjectDialogOpen}
            onOpenChange={setIsProjectDialogOpen}
            onSave={handleSaveProject}
            project={selectedProject}
          />
           <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the "{projectToDelete?.name}" project and all its tasks. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteProject}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

