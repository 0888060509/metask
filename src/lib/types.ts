export type TaskStatus = "todo" | "inprogress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline?: Date;
  assigneeId?: string;
  projectId: string;
  tags?: string[];
};

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
};

export type Project = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
};
