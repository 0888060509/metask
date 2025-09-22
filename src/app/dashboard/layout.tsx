
"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { tasks as staticTasks, projects as initialProjects, tags as initialTags, notifications as staticNotifications, users } from "@/lib/data";
import { Project, Tag, Task, Notification, User, Comment } from "@/lib/types";
import React from "react";
import { TaskDetailDialog } from "@/components/kanban/task-detail-dialog";

const getInitialTasks = (): Task[] => [
    {
      ...staticTasks[0],
      deadline: new Date(new Date().setDate(new Date().getDate() + 3)),
      comments: [
        { id: 'comment-1', taskId: 'task-1', userId: 'user-2', text: "How's this going? Any blockers?", createdAt: new Date(new Date().setDate(new Date().getDate() - 1)), parentId: null, reactions: [{emoji: '👀', userId: 'user-4'}] },
        { id: 'comment-2', taskId: 'task-1', userId: 'user-1', text: "Almost done, will share soon. The new design system is making this a breeze.", createdAt: new Date(), parentId: 'comment-1', reactions: [{emoji: '👍', userId: 'user-2'}] },
        { id: 'comment-3', taskId: 'task-1', userId: 'user-4', text: "Can't wait to see it!", createdAt: new Date(), parentId: 'comment-2', reactions: []},
        { id: 'comment-4', taskId: 'task-1', userId: 'user-2', text: "What about the mobile view?", createdAt: new Date(), parentId: null, reactions: [] },
      ],
      activity: [
        { id: 'act-1', userId: 'user-2', activityType: 'comment', timestamp: new Date(new Date().setDate(new Date().getDate() - 1)), details: 'Mike Johnson added a comment.' },
        { id: 'act-2', userId: 'user-1', activityType: 'comment', timestamp: new Date(), details: 'Sarah Lee added a comment.' },
        { id: 'act-3', userId: 'user-4', activityType: 'status_change', timestamp: new Date(new Date().setDate(new Date().getDate() - 2)), details: 'David Rodriguez changed status from To Do to In Progress.' },
        { id: 'act-4', userId: 'user-4', activityType: 'create', timestamp: new Date(new Date().setDate(new Date().getDate() - 3)), details: 'David Rodriguez created the task.' },
      ],
    },
    {
      ...staticTasks[1],
      deadline: new Date(new Date().setDate(new Date().getDate() + 5)),
      comments: [],
      activity: [
          { id: 'act-5', userId: 'user-3', activityType: 'create', timestamp: new Date(new Date().setDate(new Date().getDate() - 4)), details: 'Emily Chen created the task.' },
      ]
    },
    {
      ...staticTasks[2],
      deadline: new Date(new Date().setDate(new Date().getDate() + 7)),
      comments: [],
      activity: [
          { id: 'act-6', userId: 'user-2', activityType: 'create', timestamp: new Date(new Date().setDate(new Date().getDate() - 1)), details: 'Mike Johnson created the task.' },
      ]
    },
    {
      ...staticTasks[3],
      deadline: new Date(new Date().setDate(new Date().getDate() - 2)),
      comments: [],
      activity: [
          { id: 'act-7', userId: 'user-1', activityType: 'status_change', timestamp: new Date(new Date().setDate(new Date().getDate() - 2)), details: 'Sarah Lee changed status from In Progress to Done.' },
          { id: 'act-8', userId: 'user-1', activityType: 'create', timestamp: new Date(new Date().setDate(new Date().getDate() - 6)), details: 'Sarah Lee created the task.' },
      ]
    },
    {
      ...staticTasks[4],
      comments: [],
      activity: [
          { id: 'act-9', userId: 'user-3', activityType: 'create', timestamp: new Date(new Date().setDate(new Date().getDate() - 2)), details: 'Emily Chen created the task.' },
      ]
    },
    {
      ...staticTasks[5],
      deadline: new Date(new Date().setDate(new Date().getDate() + 10)),
      comments: [],
      activity: []
    },
    {
      ...staticTasks[6],
      deadline: new Date(new Date().setDate(new Date().getDate() - 5)),
      comments: [],
      activity: []
    },
    {
      ...staticTasks[7],
      deadline: new Date(new Date().setDate(new Date().getDate() + 1)),
      comments: [],
      activity: []
    },
  ];
  
const getInitialNotifications = (): Notification[] => [
    { ...staticNotifications[0], timestamp: new Date(new Date().setHours(new Date().getHours() - 2)) },
    { ...staticNotifications[1], timestamp: new Date(new Date().setHours(new Date().getHours() - 8)) },
    { ...staticNotifications[2], timestamp: new Date(new Date().setDate(new Date().getDate() - 1)) },
    { ...staticNotifications[3], timestamp: new Date(new Date().setDate(new Date().getDate() - 2)) },
    { ...staticNotifications[4], timestamp: new Date(new Date().setDate(new Date().getDate() - 1)) },
];


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
    const [tasks, setTasks] = React.useState<Task[]>(getInitialTasks);
    const [notifications, setNotifications] = React.useState<Notification[]>(getInitialNotifications);
    
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
