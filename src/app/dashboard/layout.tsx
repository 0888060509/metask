
"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { tasks as initialTasks, projects as initialProjects, tags as initialTags, notifications as initialNotifications, users } from "@/lib/data";
import { Project, Tag, Task, Notification, User, Comment } from "@/lib/types";
import React from "react";
import { TaskDetailDialog } from "@/components/kanban/task-detail-dialog";

export const DashboardContext = React.createContext<{
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    projects: Project[];
    tags: Tag[];
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
    users: User[];
    openTask: (task: Task) => void;
    addNotification: (notification: Omit<Notification, "id" | "timestamp" | "isRead">) => void;
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
    
    const openTask = (task: Task) => {
        setSelectedTask(task);
    };

    const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "isRead">) => {
        const newNotification: Notification = {
            ...notification,
            id: `notif-${Date.now()}`,
            timestamp: new Date(),
            isRead: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
    }
    
    const handleUpdateTask = (updatedTask: Task) => {
        setTasks((prevTasks) => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task));
        setSelectedTask(updatedTask);
    }

    const handleDeleteTask = (taskId: string) => {
        setTasks(tasks.filter(task => task.id !== taskId));
        setSelectedTask(null);
    }
    
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
        if (mentions.length > 0) {
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


    const contextValue = {
        tasks,
        setTasks,
        projects,
        tags,
        notifications,
        setNotifications,
        users,
        openTask,
        addNotification,
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
                {selectedTask && (
                    <TaskDetailDialog 
                        task={selectedTask}
                        projects={projects}
                        tags={tags}
                        onOpenChange={(isOpen) => {
                            if (!isOpen) {
                                setSelectedTask(null);
                            }
                        }}
                        onUpdate={handleUpdateTask}
                        onDelete={handleDeleteTask}
                        onComment={handleAddComment}
                    />
                )}
            </SidebarProvider>
        </DashboardContext.Provider>
    );
}
