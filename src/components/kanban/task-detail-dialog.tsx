
"use client";

import React from "react";
import { users } from "@/lib/data";
import type { Task, TaskPriority, Project } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  MessageSquare,
  Clock,
  Send,
} from "lucide-react";
import { iconMap } from "../project/icon-picker";


type TaskDetailSheetProps = {
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
    <div className="grid grid-cols-3 items-start gap-4">
      <div className="flex col-span-1 items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <div className="col-span-2 text-sm">{children}</div>
    </div>
  );
}

export function TaskDetailDialog({
  task,
  projects,
  onOpenChange,
  onEdit,
  onDelete,
}: TaskDetailSheetProps) {
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
    <Sheet open={!!task} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-4xl w-full p-0 flex flex-col" side="right">
        <SheetHeader className="p-6">
            <div className="flex items-center justify-between gap-4">
                <SheetTitle className="font-headline text-2xl flex-1 truncate">{task.title}</SheetTitle>
                <div className="flex items-center gap-2">
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
            </div>
            {task.description && <SheetDescription className="pt-1">{task.description}</SheetDescription>}
        </SheetHeader>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto p-6 pt-0">
            {/* Left Column: Tabs for Details and Activity */}
            <div className="md:col-span-2 space-y-6">
              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                  <div className="space-y-4 rounded-lg border p-4 mt-4">
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
                </TabsContent>
                <TabsContent value="activity">
                  <div className="space-y-4 mt-4">
                      <div className="flex flex-col items-center justify-center py-8 text-center rounded-lg border border-dashed">
                          <Clock className="h-10 w-10 text-muted-foreground/30" />
                          <p className="mt-2 text-sm text-muted-foreground">No activity yet.</p>
                      </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column: Comments */}
            <div className="md:col-span-1 space-y-6">
                <div className="space-y-4">
                     <h3 className="font-semibold text-lg flex items-center gap-2"><MessageSquare className="w-5 h-5 text-muted-foreground" /> Comments</h3>
                     <div className="flex flex-col items-center justify-center py-8 text-center rounded-lg border border-dashed">
                        <MessageSquare className="h-10 w-10 text-muted-foreground/30" />
                        <p className="mt-2 text-sm text-muted-foreground">No comments yet.</p>
                    </div>
                </div>
            </div>
        </div>
        <SheetFooter className="p-6 pt-0">
            <div className="relative w-full">
                <Textarea placeholder="Add a comment..." className="pr-12"/>
                <Button size="icon" className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8">
                    <Send className="h-4 w-4"/>
                    <span className="sr-only">Send Comment</span>
                </Button>
            </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
