"use client";

import React from "react";
import { users } from "@/lib/data";
import type { Task, TaskPriority, Project } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Calendar,
  Flag,
  User,
  Folder,
  Tag,
  CheckCircle,
  Edit,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { iconMap } from "../project/icon-picker";


type TaskDetailDialogProps = {
  task: Task | null;
  projects: Project[];
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: (taskId: string) => void;
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
  projects,
  onOpenChange,
  onEdit,
  onDelete,
}: TaskDetailDialogProps) {
  if (!task) return null;

  const assignee = users.find((user) => user.id === task.assigneeId);
  const project = projects.find((p) => p.id === task.projectId);
  const ProjectIcon = project ? (iconMap[project.icon as keyof typeof iconMap] || iconMap.FileText) : Folder;

  const handleEdit = () => {
    onOpenChange(false);
    onEdit();
  };
  
  const handleDelete = () => {
    onOpenChange(false);
    onDelete(task.id);
  }

  return (
    <Dialog open={!!task} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <DialogTitle className="font-headline text-2xl pr-10">{task.title}</DialogTitle>
                    {task.description && <p className="text-muted-foreground pt-1">{task.description}</p>}
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreVertical className="h-5 w-5" />
                        <span className="sr-only">More actions</span>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEdit}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
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
                <ProjectIcon className="h-4 w-4 text-muted-foreground" />
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
      </DialogContent>
    </Dialog>
  );
}
