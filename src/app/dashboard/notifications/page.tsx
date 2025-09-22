
"use client";

import React from "react";
import { AppHeader } from "@/components/app-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tasks, users } from "@/lib/data";
import { Notification, Task, User } from "@/lib/types";
import { format, formatDistanceToNowStrict, isToday, isYesterday } from "date-fns";
import { cn } from "@/lib/utils";
import { MessageSquare, UserPlus, CheckCircle } from "lucide-react";
import { DashboardContext } from "../layout";

type NotificationItemProps = {
  notification: Notification;
  onNotificationClick: (taskId: string) => void;
};

const notificationIcons = {
  comment: MessageSquare,
  assignment: UserPlus,
  status_change: CheckCircle,
};

const getNotificationText = (notification: Notification, actor?: User, task?: Task) => {
    const actorName = <strong className="font-medium">{actor?.name || 'Someone'}</strong>;
    const taskTitle = <em className="font-normal">{task?.title || 'a task'}</em>;

    switch(notification.type) {
        case 'comment':
            return <>{actorName} commented on {taskTitle}.</>;
        case 'assignment':
            return <>{actorName} assigned you to {taskTitle}.</>;
        case 'status_change':
             return <>{actorName} updated the status of {taskTitle}.</>;
        default:
            return "You have a new notification.";
    }
}


function NotificationItem({ notification, onNotificationClick }: NotificationItemProps) {
  const actor = users.find((u) => u.id === notification.actorId);
  const task = tasks.find((t) => t.id === notification.taskId);
  const Icon = notificationIcons[notification.type];

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-colors hover:bg-muted",
        !notification.isRead && "bg-primary/5"
      )}
      onClick={() => onNotificationClick(notification.taskId)}
    >
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage src={actor?.avatarUrl} alt={actor?.name} data-ai-hint="person portrait"/>
          <AvatarFallback>{actor?.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 bg-background p-0.5 rounded-full">
            <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm text-foreground">{getNotificationText(notification, actor, task)}</p>
        <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNowStrict(notification.timestamp, { addSuffix: true })}
        </p>
      </div>
      {!notification.isRead && (
        <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1"></div>
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
        // This can happen if the page is rendered outside the layout with the context provider.
        // You might want to show a loading state or an error message.
        return <div>Loading...</div>;
    }
    const { notifications, setNotifications, handleOpenTaskFromNotification } = context;

    // This would be the ID of the currently logged-in user.
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
        } else {
            key = format(notif.timestamp, 'MMMM d, yyyy');
        }
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(notif);
        return acc;
    }, {});

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
                           Object.entries(groupedNotifications).map(([group, notifs]) => (
                               <div key={group} className="border-t">
                                   <h3 className="text-sm font-semibold text-muted-foreground px-6 py-3 bg-muted/50">{group}</h3>
                                   <div className="flex flex-col">
                                    {notifs.map((notification) => (
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
