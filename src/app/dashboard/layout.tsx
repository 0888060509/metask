
"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { tasks as initialTasks, projects as initialProjects, tags as initialTags, notifications as initialNotifications } from "@/lib/data";
import { Project, Tag, Task, Notification } from "@/lib/types";
import React from "react";
import { TaskDetailDialog } from "@/components/kanban/task-detail-dialog";

export const DashboardContext = React.createContext<{
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
    handleOpenTaskFromNotification: (taskId: string) => void;
} | null>(null);


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [projects, setProjects] = React.useState<Project[]>(initialProjects);
    const [tags, setTags] = React.useState<Tag[]>(initialTags);
    const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
    const [notifications, setNotifications] = React.useState<Notification[]>(initialNotifications);
    
    // This would be the ID of the currently logged-in user.
    const currentUserId = "user-4";
    const unreadCount = notifications.filter(n => n.userId === currentUserId && !n.isRead).length;

    // Dummy handlers for sidebar functionality
    const handleCreateProject = () => {};
    const handleEditProject = (project: Project) => {};
    const handleDeleteProject = (project: Project) => {};

    const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
    const handleOpenTaskFromNotification = (taskId: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            setSelectedTask(task);
        }
        // Mark notification as read
        setNotifications(prev => prev.map(n => n.taskId === taskId ? { ...n, isRead: true } : n));
    };

    const contextValue = {
        notifications,
        setNotifications,
        handleOpenTaskFromNotification,
    };

    return (
        <DashboardContext.Provider value={contextValue}>
            <SidebarProvider>
                <AppSidebar
                    projects={projects}
                    onNewProjectClick={handleCreateProject}
                    onEditProject={handleEditProject}
                    onDeleteProject={handleDeleteProject}
                    unreadNotificationCount={unreadCount}
                />
                <SidebarInset>
                    {children}
                </SidebarInset>
                <TaskDetailDialog 
                    task={selectedTask}
                    projects={projects}
                    tags={tags}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            setSelectedTask(null);
                        }
                    }}
                    onUpdate={() => {}}
                    onDelete={() => {}}
                    onComment={() => {}}
                />
            </SidebarProvider>
        </DashboardContext.Provider>
    );
}
