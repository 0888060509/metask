export type TaskStatus = "todo" | "inprogress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export type Reaction = {
  emoji: string;
  userId: string;
}

export type Comment = {
  id: string;
  taskId: string;
  userId: string;
  text: string;
  createdAt: Date;
  parentId?: string | null;
  reactions?: Reaction[];
};

export type Activity = {
  id:string;
  userId: string;
  activityType: 'create' | 'update' | 'status_change' | 'comment';
  timestamp: Date;
  details: string;
};

export type Tag = {
  id: string;
  name: string;
  color: `bg-${string}-500/10 text-${string}-700 dark:text-${string}-400`;
}

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline?: Date;
  assigneeIds?: string[];
  projectId: string;
  tagIds?: string[];
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

export type Notification = {
  id: string;
  userId: string; // The user who should receive the notification
  actorId: string; // The user who performed the action
  type: 'comment' | 'assignment' | 'status_change' | 'mention' | 'new_comment' | 'due_reminder';
  taskId?: string;
  isRead: boolean;
  timestamp: Date;
  details?: {
    newStatus?: TaskStatus;
    commentId?: string;
  };
};
