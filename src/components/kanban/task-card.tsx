"use client";
import React from "react";
import { users } from "@/lib/data";
import type { Task } from "@/lib/types";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Edit, Flag, MoreHorizontal, Trash2 } from "lucide-react";

type TaskCardProps = {
  task: Task;
};

const priorityClasses: Record<Task["priority"], string> = {
  low: "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400",
  medium: "border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  high: "border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400",
};

export function TaskCard({ task }: TaskCardProps) {
  const assignee = users.find((user) => user.id === task.assigneeId);
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", task.id);
  };
  
  return (
    <Card 
      draggable 
      onDragStart={handleDragStart}
      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-base">{task.title}</CardTitle>
          {task.description && (
            <CardDescription>{task.description}</CardDescription>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="-mt-1.5 -mr-2.5 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
            <MoreHorizontal className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/40">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Badge
          variant="outline"
          className={cn("text-xs", priorityClasses[task.priority])}
        >
          <Flag className="mr-1.5 h-3 w-3" />
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </Badge>
        {task.tags?.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {task.deadline && (
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
