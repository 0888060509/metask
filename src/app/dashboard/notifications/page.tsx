

"use client";

import React from "react";
import { AppHeader } from "@/components/app-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { tasks, users } from "@/lib/data";
import { Notification, Task, User } from "@/lib/types";
import { isToday, isYesterday } from "date-fns";
import { formatDistanceToNowStrict } from "date-fns";
import { cn } from "@/lib/utils";
import { MessageSquare, UserPlus, CheckCircle, AtSign, FileClock, Check } from "lucide-react";
import { DashboardContext } from "../layout";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";


type NotificationItemProps = {
  notification: Notification;
  onNotificationClick: (task: Task) => void;
  onMarkAsRead: (notificationId: string) => void;
};

type FilterType = "all" | "direct" | "following";

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

function NotificationItem({ notification, onNotificationClick, onMarkAsRead }: NotificationItemProps) {
  const actor = users.find((u) => u.id === notification.actorId);
  const task = tasks.find((t) => t.id === notification.taskId);
  const Icon = notificationIcons[notification.type];
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
     <div
      className={cn(
        "group relative flex items-start gap-4 p-4 border-l-4",
        notification.isRead ? "border-transparent" : "border-primary"
      )}
    >
      <div className="absolute -left-px top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        {!notification.isRead && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 rounded-full bg-background hover:bg-muted"
                    onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsRead(notification.id)
                    }}
                >
                    <Check className="h-4 w-4 text-primary" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Mark as read</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div
        className={cn("flex-1 flex items-start gap-4 pl-4 cursor-pointer", notification.isRead && "opacity-60 hover:opacity-100 transition-opacity")}
        onClick={() => notification.taskId && task && onNotificationClick(task)}
      >
        <div className="relative h-10 w-10 shrink-0">
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
                {isClient ? formatDistanceToNowStrict(notification.timestamp, { addSuffix: true }) : null}
            </p>
            {getNotificationContext(notification, task)}
        </div>
      </div>
    </div>
  );
}

type GroupedNotifications = {
    [key: string]: Notification[];
}

export default function NotificationsPage() {
    const context = React.useContext(DashboardContext);
    const [filterType, setFilterType] = React.useState<FilterType>('all');

    if (!context) {
        return <div>Loading...</div>;
    }
    const { notifications, setNotifications, openTask } = context;

    const currentUserId = "user-4";

    const userNotifications = notifications
        .filter((n: Notification) => n.userId === currentUserId)
        .sort((a: Notification, b: Notification) => b.timestamp.getTime() - a.timestamp.getTime());
    
    const directNotifications = userNotifications.filter(n => n.type === 'mention' || n.type === 'assignment' || n.type === 'due_reminder');
    const followingNotifications = userNotifications.filter(n => n.type === 'new_comment' || n.type === 'status_change');

    const filteredNotifications = React.useMemo(() => {
        if (filterType === 'all') return userNotifications;
        if (filterType === 'direct') return directNotifications;
        if (filterType === 'following') return followingNotifications;
        return [];
    }, [userNotifications, directNotifications, followingNotifications, filterType]);

    const groupedNotifications = filteredNotifications.reduce((acc: GroupedNotifications, notif: Notification) => {
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
    
    const unreadCount = filteredNotifications.filter(n => !n.isRead).length;
    const unreadDirectCount = directNotifications.filter(n => !n.isRead).length;
    const unreadFollowingCount = followingNotifications.filter(n => !n.isRead).length;

    const handleMarkAllAsRead = () => {
        const notificationIdsToMark = filteredNotifications.filter(n => !n.isRead).map(n => n.id);
        setNotifications((prev: Notification[]) => prev.map(n => notificationIdsToMark.includes(n.id) ? { ...n, isRead: true } : n));
    };

    const handleMarkAsRead = (notificationId: string) => {
        setNotifications((prev: Notification[]) => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
    };

    return (
        <div className="flex h-full flex-col">
            <AppHeader title="Notifications" />
            <div className="border-b px-4 py-2">
                <div className="flex items-center justify-between">
                    <Tabs value={filterType} onValueChange={(value) => setFilterType(value as FilterType)}>
                        <TabsList>
                            <TabsTrigger value="all" className="flex items-center gap-2">
                                All
                            </TabsTrigger>
                            <TabsTrigger value="direct" className="flex items-center gap-2">
                                Direct
                                {unreadDirectCount > 0 && <Badge variant="secondary" className="px-1.5">{unreadDirectCount}</Badge>}
                            </TabsTrigger>
                            <TabsTrigger value="following" className="flex items-center gap-2">
                                Following
                                {unreadFollowingCount > 0 && <Badge variant="secondary" className="px-1.5">{unreadFollowingCount}</Badge>}
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                    {unreadCount > 0 && (
                        <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">Mark all as read</Button>
                    )}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                <Card className="max-w-3xl mx-auto my-4 md:my-6">
                    <CardContent className="p-0">
                        {filteredNotifications.length === 0 ? (
                             <div className="text-center p-12">
                                <p className="text-muted-foreground">You have no notifications for this filter.</p>
                            </div>
                        ) : (
                           orderedGroups.map((group) => (
                               <div key={group} className="border-t first:border-t-0">
                                   <h3 className="text-sm font-semibold text-muted-foreground px-6 py-3 bg-muted/50">{group}</h3>
                                   <div className="flex flex-col">
                                    {groupedNotifications[group].map((notification) => (
                                        <NotificationItem
                                            key={notification.id}
                                            notification={notification}
                                            onNotificationClick={(task) => {
                                                handleMarkAsRead(notification.id);
                                                openTask(task);
                                            }}
                                            onMarkAsRead={handleMarkAsRead}
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
