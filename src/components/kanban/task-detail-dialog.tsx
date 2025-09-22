"use client";

import React from "react";
import { projects, users } from "@/lib/data";
import type { Task, TaskPriority } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Calendar,
  Flag,
  User,
  Folder,
  Tag,
  AlignLeft,
  CheckCircle,
  Edit,
} from "lucide-react";

type TaskDetailDialogProps = {
  task: Task | null;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
};

const priorityClasses: Record<TaskPriority, string> = {
  low: "text-green-600 dark:text-green-400",
  medium: "text-yellow-600 dark:text-yellow-400",
  high: "text-red-600 dark:text-red-400",
};

const statusClasses = {
  todo: "bg-gray-500",
  inprogress: "bg-blue-500",
  done: "bg-green-500",
};

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <div className="col-span-3 text-sm">{children}</div>
    </div>
  );
}

export function TaskDetailDialog({
  task,
  onOpenChange,
  onEdit,
}: TaskDetailDialogProps) {
  if (!task) return null;

  const assignee = users.find((user) => user.id === task.assigneeId);
  const project = projects.find((p) => p.id === task.projectId);

  const handleEdit = () => {
    onOpenChange(false);
    onEdit();
  };

  return (
    <Dialog open={!!task} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">{task.title}</DialogTitle>
          <DialogDescription>{task.description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <DetailRow icon={CheckCircle} label="Status">
            <Badge className={cn("text-white", statusClasses[task.status])}>
              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </Badge>
          </DetailRow>

          <DetailRow icon={Flag} label="Priority">
            <span
              className={cn("font-medium", priorityClasses[task.priority])}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          </DetailRow>

          {assignee && (
            <DetailRow icon={User} label="Assignee">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={assignee.avatarUrl} alt={assignee.name} data-ai-hint="person portrait"/>
                  <AvatarFallback>
                    {assignee.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>{assignee.name}</span>
              </div>
            </DetailRow>
          )}

          {project && (
            <DetailRow icon={Folder} label="Project">
              <div className="flex items-center gap-2">
                <project.icon className="h-4 w-4 text-muted-foreground" />
                <span>{project.name}</span>
              </div>
            </DetailRow>
          )}

          {task.deadline && (
            <DetailRow icon={Calendar} label="Deadline">
              {format(task.deadline, "PPP")}
            </DetailRow>
          )}

          {task.tags && task.tags.length > 0 && (
            <DetailRow icon={Tag} label="Tags">
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </DetailRow>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
