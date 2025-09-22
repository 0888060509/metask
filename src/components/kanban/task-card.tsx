"use client";
import React from "react";
import { users, tags } from "@/lib/data";
import type { Task, Project, Tag } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Flag } from "lucide-react";
import { iconMap } from "../project/icon-picker";

type TaskCardProps = {
  task: Task;
  project?: Project;
  onTaskClick: (task: Task) => void;
};

const priorityClasses: Record<Task["priority"], string> = {
  low: "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400",
  medium: "border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  high: "border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400",
};

export function TaskCard({ task, project, onTaskClick }: TaskCardProps) {
  const assignee = users.find((user) => user.id === task.assigneeId);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", task.id);
  };
  
  const ProjectIcon = project ? (iconMap[project.icon as keyof typeof iconMap] || iconMap.FileText) : null;
  const taskTags = task.tagIds?.map(tagId => tags.find(t => t.id === tagId)).filter(Boolean) as Tag[];

  return (
    <Card 
      draggable 
      onDragStart={handleDragStart}
      onClick={() => onTaskClick(task)}
      className="cursor-pointer active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <CardHeader>
        <CardTitle className="text-base break-words">{task.title}</CardTitle>
        {task.description && (
          <CardDescription>{task.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-2">
        {project && ProjectIcon && (
          <Badge variant="outline" className="text-xs font-medium">
             <ProjectIcon className="mr-1.5 h-3 w-3" />
            {project.name}
          </Badge>
        )}
        <Badge
          variant="outline"
          className={cn("text-xs", priorityClasses[task.priority])}
        >
          <Flag className="mr-1.5 h-3 w-3" />
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </Badge>
        {taskTags?.map((tag) => (
          <Badge key={tag.id} variant="outline" className={cn("text-xs", tag.color)}>
            {tag.name}
          </Badge>
        ))}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {task.deadline && isClient && (
            <>
              <Calendar className="h-4 w-4" />
              <span>
                {formatDistanceToNow(task.deadline, { addSuffix: true })}
              </span>
            </>
          )}
        </div>
        {assignee && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={assignee.avatarUrl} alt={assignee.name} data-ai-hint="person portrait"/>
            <AvatarFallback>
              {assignee.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </CardFooter>
    </Card>
  );
}
