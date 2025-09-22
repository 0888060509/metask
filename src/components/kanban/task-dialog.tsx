"use client";

import { users } from "@/lib/data";
import type { Task, TaskPriority, Project } from "@/lib/types";
import React from "react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type TaskDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  onSave: (task: Omit<Task, "id" | "status">) => void;
  projects: Project[];
};

export function TaskDialog({ open, onOpenChange, task, onSave, projects }: TaskDialogProps) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [assigneeId, setAssigneeId] = React.useState<string | undefined>();
  const [projectId, setProjectId] = React.useState("");
  const [priority, setPriority] = React.useState<TaskPriority>("medium");
  const [deadline, setDeadline] = React.useState<Date | undefined>();

  const handleSave = () => {
    if (!title || !projectId) {
        // Basic validation
        alert("Title and Project are required.");
        return;
    }
    onSave({
      title,
      description,
      assigneeId,
      projectId,
      priority,
      deadline,
    });
    onOpenChange(false);
  };
  
  React.useEffect(() => {
    if (open) {
        setTitle(task?.title || "");
        setDescription(task?.description || "");
        setAssigneeId(task?.assigneeId);
        setProjectId(task?.projectId || "");
        setPriority(task?.priority || 'medium');
        setDeadline(task?.deadline);
    }
  }, [open, task]);
  
  const userOptions = React.useMemo(() => users.map(user => ({ value: user.id, label: user.name })), []);
  const projectOptions = React.useMemo(() => projects.map(project => ({ value: project.id, label: project.name })), [projects]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{task ? "Edit Task" : "Create Task"}</DialogTitle>
          <DialogDescription>
            {task ? "Update the details of your task." : "Fill in the details for your new task."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignee" className="text-right">
              Assignee
            </Label>
            <Combobox
              className="col-span-3"
              options={userOptions}
              value={assigneeId}
              onValueChange={setAssigneeId}
              placeholder="Select an assignee"
              searchPlaceholder="Search assignees..."
              emptyResult="No assignees found."
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="project" className="text-right">
              Project
            </Label>
             <Combobox
                className="col-span-3"
                options={projectOptions}
                value={projectId}
                onValueChange={setProjectId}
                placeholder="Select a project"
                searchPlaceholder="Search projects..."
                emptyResult="No projects found."
            />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deadline" className="text-right">
              Deadline
            </Label>
            <DatePicker date={deadline} setDate={setDeadline} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
