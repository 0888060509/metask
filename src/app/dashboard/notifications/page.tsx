
"use client";

import React from "react";
import { AppHeader } from "@/components/app-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tasks, users } from "@/lib/data";
import { Notification, Task, User, Comment } from "@/lib/types";
import { format, formatDistanceToNowStrict, isToday, isYesterday } from "date-fns";
import { cn } from "@/lib/utils";
import { MessageSquare, UserPlus, CheckCircle, AtSign, FileClock } from "lucide-react";
import { DashboardContext } from "../layout";

type NotificationItemProps = {
  notification: Notification;
  onNotificationClick: (taskId: string) => void;
};

const notificationIcons = {
  comment: MessageSquare,
  assignment: UserPlus,
  status_change: CheckCircle,
  mention: AtSign,
  new_comment: MessageSquare,
  due_reminder: FileClock,
};

const getNotificationText = (notification: Notification, actor?: User, task?: Task) => {
    const actorName = <strong className="font-medium">{actor?.name || 'Someone'}</strong>;
    const taskTitle = <em className="font-normal">{task?.title || 'a task'}</em>;

    switch(notification.type) {
        case 'assignment':
            return <>You have just been assigned the task {taskTitle} by {actorName}.</>;
        case 'status_change':
             const newStatus = <strong className="font-medium">{notification.details?.newStatus || 'a new status'}</strong>;
             return <>The task {taskTitle} you are following has been moved to {newStatus}.</>;
        case 'mention':
            return <>{actorName} mentioned you in the task {taskTitle}.</>;
        case 'new_comment':
            return <>There is a new comment in the task {taskTitle} you are following.</>;
        case 'due_reminder':
            return <>The task {taskTitle} is due tomorrow.</>;
        case 'comment': // Fallback for old comment type
             return <>{actorName} commented on {taskTitle}.</>;
        default:
            return "You have a new notification.";
    }
}

const getNotificationContext = (notification: Notification, task?: Task) => {
    if (notification.type === 'mention' || notification.type === 'new_comment' || notification.type === 'comment') {
        const commentId = notification.details?.commentId;
        if (!commentId || !task?.comments) return null;

        const comment = task.comments.find(c => c.id === commentId);
        if (!comment) return null;

        return (
            <div className="mt-2 text-sm p-3 bg-muted/70 rounded-md border text-muted-foreground break-words whitespace-pre-wrap">
                "{comment.text}"
            </div>
        )
    }
    return null;
}

function NotificationItem({ notification, onNotificationClick }: NotificationItemProps) {
  const actor = users.find((u) => u.id === notification.actorId);
  const task = tasks.find((t) => t.id === notification.taskId);
  const Icon = notificationIcons[notification.type];

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 cursor-pointer transition-colors hover:bg-muted",
        !notification.isRead && "bg-primary/5"
      )}
      onClick={() => notification.taskId && onNotificationClick(notification.taskId)}
    >
        <div className="relative h-10 w-10">
             <div className="h-10 w-10 flex items-center justify-center rounded-full bg-muted">
                <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            {actor && (
                <Avatar className="absolute -bottom-1 -right-1 h-5 w-5 border-2 border-background">
                    <AvatarImage src={actor?.avatarUrl} alt={actor?.name} data-ai-hint="person portrait"/>
                    <AvatarFallback className="text-[10px]">{actor?.name.charAt(0)}</AvatarFallback>
                </Avatar>
            )}
      </div>
      <div className="flex-1">
        <p className="text-sm text-foreground">{getNotificationText(notification, actor, task)}</p>
        <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNowStrict(notification.timestamp, { addSuffix: true })}
        </p>
        {getNotificationContext(notification, task)}
      </div>
      {!notification.isRead && (
        <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1 shrink-0"></div>
      )}
    </div>
  );
}

type GroupedNotifications = {
    [key: string]: Notification[];
}

export default function NotificationsPage() {
    const context = React.useContext(DashboardContext);

    if (!context) {
        return <div>Loading...</div>;
    }
    const { notifications, setNotifications, handleOpenTaskFromNotification } = context;

    const currentUserId = "user-4";

    const userNotifications = notifications
        .filter((n: Notification) => n.userId === currentUserId)
        .sort((a: Notification, b: Notification) => b.timestamp.getTime() - a.timestamp.getTime());
    
    const groupedNotifications = userNotifications.reduce((acc: GroupedNotifications, notif: Notification) => {
        let key = 'Older';
        if (isToday(notif.timestamp)) {
            key = 'Today';
        } else if (isYesterday(notif.timestamp)) {
            key = 'Yesterday';
        }
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(notif);
        return acc;
    }, {});
    
    const orderedGroups = ['Today', 'Yesterday', 'Older'].filter(group => groupedNotifications[group]);

    const handleMarkAllAsRead = () => {
        setNotifications((prev: Notification[]) => prev.map(n => n.userId === currentUserId ? { ...n, isRead: true } : n));
    };

    return (
        <div className="flex h-full flex-col">
            <AppHeader title="Notifications" />
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <Card className="max-w-3xl mx-auto">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="font-headline">Your Updates</CardTitle>
                        <button onClick={handleMarkAllAsRead} className="text-sm font-medium text-primary hover:underline">Mark all as read</button>
                    </CardHeader>
                    <CardContent className="p-0">
                        {userNotifications.length === 0 ? (
                             <div className="text-center p-12">
                                <p className="text-muted-foreground">You have no new notifications.</p>
                            </div>
                        ) : (
                           orderedGroups.map((group) => (
                               <div key={group} className="border-t">
                                   <h3 className="text-sm font-semibold text-muted-foreground px-6 py-3 bg-muted/50">{group}</h3>
                                   <div className="flex flex-col">
                                    {groupedNotifications[group].map((notification) => (
                                        <NotificationItem
                                            key={notification.id}
                                            notification={notification}
                                            onNotificationClick={handleOpenTaskFromNotification}
                                        />
                                    ))}
                                   </div>
                               </div>
                           ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
