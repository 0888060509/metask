export type TaskStatus = "todo" | "inprogress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export type Comment = {
  id: string;
  taskId: string;
  userId: string;
  text: string;
  createdAt: Date;
};

export type Activity = {
  id: string;
  userId: string;
  activityType: 'create' | 'update' | 'status_change' | 'comment';
  timestamp: Date;
  details: string;
};

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
  comments?: Comment[];
  activity?: Activity[];
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
  icon: string;
};
