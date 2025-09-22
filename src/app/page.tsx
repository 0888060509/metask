

"use client";

import * as React from "react";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { TaskDialog } from "@/components/kanban/task-dialog";
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
import { projects as initialProjects, notifications as initialNotifications, users } from "@/lib/data";
import type { Task, TaskPriority, Project } from "@/lib/types";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { KanbanToolbar } from "@/components/kanban/kanban-toolbar";
import { DashboardContext } from "./dashboard/layout";

export type Filters = {
  projects: string[];
  assignees: string[];
  priorities: TaskPriority[];
};

export default function Home() {
  const context = React.useContext(DashboardContext);
  
  const [projects, setProjects] = React.useState<Project[]>(initialProjects);

  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = React.useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = React.useState<Project | null>(null);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [filters, setFilters] = React.useState<Filters>({
    projects: [],
    assignees: [],
    priorities: [],
  });
  
  if (!context) return null;
  const { tasks, setTasks, openTask, tags } = context;

  // This would be the ID of the currently logged-in user.
  const currentUserId = "user-1";

  const unreadCount = context.notifications.filter(n => n.userId === "user-4" && !n.isRead).length ?? 0;

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
              onTaskClick={openTask}
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
