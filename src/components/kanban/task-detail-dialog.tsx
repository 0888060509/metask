

"use client";

import React from "react";
import { users } from "@/lib/data";
import type { Task, TaskPriority, Project, Tag, User, Comment, Reaction } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Combobox } from "@/components/ui/combobox";
import { MultiSelectCombobox } from "@/components/ui/multi-select-combobox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import {
  Calendar,
  Flag,
  User as UserIcon,
  Folder,
  Tag as TagIcon,
  CheckCircle,
  Edit,
  Trash2,
  MessageSquare,
  Clock,
  Send,
  Save,
  X,
  MoreHorizontal,
  Smile,
  MessageSquareReply,
  Check,
} from "lucide-react";
import { iconMap } from "../project/icon-picker";
import { Separator } from "../ui/separator";
import { DetailRow } from "../ui/detail-row";


type TaskDetailSheetProps = {
  task: Task | null;
  projects: Project[];
  tags: Tag[];
  onOpenChange: (open: boolean) => void;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onComment: (taskId: string, commentText: string, parentId?: string | null) => void;
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

const availableReactions = ['👍', '🎉', '👀', '❤️', '🤔', '👎'];

// A new sub-component for rendering each comment and its children
const CommentItem = ({ 
    comment,
    allComments,
    onReply,
    onEdit,
    onDelete,
    onAddReaction,
    currentUserId
}: { 
    comment: Comment,
    allComments: Comment[],
    onReply: (commentId: string, text: string) => void,
    onEdit: (commentId: string, text: string) => void,
    onDelete: (commentId: string) => void,
    onAddReaction: (commentId: string, emoji: string) => void,
    currentUserId: string
}) => {
    const commentUser = users.find(u => u.id === comment.userId);
    const children = allComments.filter(c => c.parentId === comment.id);
    
    const [isReplying, setIsReplying] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [replyText, setReplyText] = React.useState("");
    const [editText, setEditText] = React.useState(comment.text);

    const handleReply = () => {
        onReply(comment.id, replyText);
        setReplyText("");
        setIsReplying(false);
    };
    
    const handleEdit = () => {
        onEdit(comment.id, editText);
        setIsEditing(false);
    }
    
    const userHasReacted = (emoji: string) => {
        return comment.reactions?.some(r => r.userId === currentUserId && r.emoji === emoji);
    }

    return (
        <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
                <AvatarImage src={commentUser?.avatarUrl} data-ai-hint="person portrait"/>
                <AvatarFallback>{commentUser?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{commentUser?.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(comment.createdAt, { addSuffix: true })}</p>
                </div>
                {isEditing ? (
                     <div className="mt-2">
                        <Textarea value={editText} onChange={e => setEditText(e.target.value)} className="mb-2"/>
                        <div className="flex gap-2">
                            <Button size="sm" onClick={handleEdit}>Save</Button>
                            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm bg-muted rounded-lg p-2 mt-1 break-words whitespace-pre-wrap">{comment.text}</p>
                )}

                <div className="flex items-center gap-2 mt-1">
                    <Popover>
                        <PopoverTrigger asChild>
                             <Button size="xs" variant="ghost" className="text-muted-foreground">
                                <Smile className="h-4 w-4 mr-1"/> Add reaction
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-1">
                            <div className="flex gap-1">
                                {availableReactions.map(emoji => (
                                    <Button key={emoji} variant={userHasReacted(emoji) ? "outline-primary" : "ghost"} size="icon" className="h-8 w-8 text-lg" onClick={() => onAddReaction(comment.id, emoji)}>
                                        {emoji}
                                    </Button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                    <Button size="xs" variant="ghost" className="text-muted-foreground" onClick={() => setIsReplying(!isReplying)}>
                        <MessageSquareReply className="h-4 w-4 mr-1"/> Reply
                    </Button>
                     {comment.userId === currentUserId && (
                        <>
                        <Button size="xs" variant="ghost" className="text-muted-foreground" onClick={() => setIsEditing(!isEditing)}>
                            <Edit className="h-4 w-4 mr-1"/> Edit
                        </Button>
                         <Button size="xs" variant="ghost" className="text-red-500 hover:text-red-500" onClick={() => onDelete(comment.id)}>
                            <Trash2 className="h-4 w-4 mr-1"/> Delete
                        </Button>
                        </>
                    )}
                </div>
                
                 {comment.reactions && comment.reactions.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                        {Object.entries(comment.reactions.reduce((acc, r) => {
                            acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                            return acc;
                        }, {} as Record<string, number>)).map(([emoji, count]) => (
                            <Badge 
                                key={emoji} 
                                variant={userHasReacted(emoji) ? "outline-primary" : "secondary"}
                                className="cursor-pointer"
                                onClick={() => onAddReaction(comment.id, emoji)}
                            >
                                {emoji} {count}
                            </Badge>
                        ))}
                    </div>
                )}

                {isReplying && (
                    <div className="mt-2">
                        <Textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder={`Reply to ${commentUser?.name}...`} className="mb-2"/>
                        <div className="flex gap-2">
                            <Button size="sm" onClick={handleReply}>Reply</Button>
                            <Button size="sm" variant="ghost" onClick={() => setIsReplying(false)}>Cancel</Button>
                        </div>
                    </div>
                )}

                <div className="mt-4 space-y-4 pl-6 border-l">
                    {children.map(child => (
                        <CommentItem 
                            key={child.id} 
                            comment={child}
                            allComments={allComments}
                            onReply={onReply}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onAddReaction={onAddReaction}
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}


export function TaskDetailDialog({
  task,
  projects,
  tags,
  onOpenChange,
  onUpdate,
  onDelete,
  onComment,
}: TaskDetailSheetProps) {
  const [commentText, setCommentText] = React.useState("");
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedTask, setEditedTask] = React.useState<Partial<Task>>({});
  
  // This would be the ID of the currently logged-in user.
  const currentUserId = "user-1";

  const userOptions = React.useMemo(() => users.map(user => ({ value: user.id, label: user.name })), []);
  const projectOptions = React.useMemo(() => projects.map(project => ({ value: project.id, label: project.name })), [projects]);
  const tagOptions = React.useMemo(() => tags.map(tag => ({ value: tag.id, label: tag.name })), [tags]);
  
  React.useEffect(() => {
    if (task) {
        setEditedTask({
            ...task,
            deadline: task.deadline ? new Date(task.deadline) : undefined,
        });
    } else {
        setIsEditing(false);
    }
  }, [task]);

  const handleEditToggle = () => {
    if (isEditing) {
      if(task) setEditedTask(task);
    }
    setIsEditing(!isEditing);
  };
  
  const handleDelete = () => {
    if (task) {
      onOpenChange(false);
      onDelete(task.id);
    }
  }

  const handleSendComment = (text: string, parentId: string | null = null) => {
    if (task && text.trim()) {
      onComment(task.id, text, parentId);
      setCommentText(""); // Clear main comment box
    }
  };

  const handleEditComment = (commentId: string, newText: string) => {
     if (!task) return;
     const newComments = (task.comments || []).map(c => c.id === commentId ? {...c, text: newText} : c);
     onUpdate({...task, comments: newComments});
  }
  
  const handleDeleteComment = (commentId: string) => {
      if (!task) return;
      // This is a simple delete. A more robust solution would handle child comments.
      const newComments = (task.comments || []).filter(c => c.id !== commentId && c.parentId !== commentId);
      onUpdate({...task, comments: newComments});
  }

  const handleAddReaction = (commentId: string, emoji: string) => {
    if (!task) return;
    const newComments = (task.comments || []).map(c => {
        if (c.id === commentId) {
            const existingReactionIndex = (c.reactions || []).findIndex(r => r.userId === currentUserId && r.emoji === emoji);
            let newReactions: Reaction[];

            if (existingReactionIndex > -1) {
                // User is removing their reaction
                newReactions = c.reactions!.filter((_, index) => index !== existingReactionIndex);
            } else {
                // User is adding a new reaction
                newReactions = [...(c.reactions || []), { userId: currentUserId, emoji }];
            }
            return {...c, reactions: newReactions};
        }
        return c;
    });
    onUpdate({...task, comments: newComments});
  }
  
  const handleSave = () => {
    if (task) {
      onUpdate({ ...task, ...editedTask } as Task);
      setIsEditing(false);
    }
  };

  const handleFieldChange = (field: keyof Task, value: any) => {
    setEditedTask(prev => ({ ...prev, [field]: value }));
  };
  
  const currentTask = isEditing ? editedTask : task;
  
  const assignees = React.useMemo(() => {
    if (!currentTask?.assigneeIds) return [];
    return currentTask.assigneeIds.map(id => users.find(user => user.id === id)).filter(Boolean) as User[];
  }, [currentTask?.assigneeIds]);
  
  const project = React.useMemo(() => {
    if (!currentTask) return null;
    return projects.find((p) => p.id === currentTask.projectId);
  }, [currentTask, projects]);

  const taskTags = React.useMemo(() => {
    if (!currentTask?.tagIds) return [];
    return currentTask.tagIds.map(tagId => tags.find(t => t.id === tagId)).filter(Boolean) as Tag[];
  }, [currentTask?.tagIds, tags]);

  const sortedActivity = React.useMemo(() => {
    if (!task?.activity) return [];
    return [...task.activity].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [task?.activity]);
  
  const rootComments = React.useMemo(() => {
    if (!task?.comments) return [];
    return task.comments.filter(c => !c.parentId);
  }, [task?.comments]);


  const ProjectIcon = project ? (iconMap[project.icon as keyof typeof iconMap] || iconMap.FileText) : Folder;

  return (
    <Sheet open={!!task} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-4xl w-full p-0 flex flex-col" side="right">
        {!task || !currentTask ? (
          <div className="flex items-center justify-center h-full">
            <p>Loading task...</p>
          </div>
        ) : (
          <>
            <SheetHeader className="p-6 border-b">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                         <ProjectIcon className="h-6 w-6 text-muted-foreground" />
                        {isEditing ? (
                                <Input 
                                id="title" 
                                value={currentTask.title || ''} 
                                onChange={(e) => handleFieldChange('title', e.target.value)}
                                className="font-headline text-2xl h-auto p-0 border-0 shadow-none focus-visible:ring-0"
                            />
                        ) : (
                            <SheetTitle className="font-headline text-2xl flex-1 break-words">{task.title}</SheetTitle>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <Button variant="outline" onClick={handleEditToggle}>
                                <X className="mr-2 h-4 w-4"/>
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>
                                <Save className="mr-2 h-4 w-4"/>
                                Save
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="outline" onClick={handleEditToggle}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        <span>Delete Task</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                          </>
                        )}
                        <SheetClose asChild>
                            <Button variant="ghost" size="icon">
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </Button>
                        </SheetClose>
                    </div>
                </div>
            </SheetHeader>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-0 overflow-y-auto">
                {/* Left Column: Title and Description */}
                <div className="md:col-span-2 p-6 space-y-6">
                    {isEditing ? (
                        <Textarea
                            id="description"
                            value={currentTask.description || ''}
                            onChange={(e) => handleFieldChange('description', e.target.value)}
                            placeholder="Add a description..."
                            className="text-sm text-muted-foreground p-0 border-0 shadow-none focus-visible:ring-0 min-h-[100px]"
                        />
                    ) : (
                        task.description ? <SheetDescription className="pt-1 break-words whitespace-pre-wrap">{task.description}</SheetDescription> : <p className="pt-1 text-sm text-muted-foreground italic">No description provided.</p>
                    )}

                    <Separator/>

                    <Tabs defaultValue="comments">
                        <TabsList>
                            <TabsTrigger value="comments">Comments</TabsTrigger>
                            <TabsTrigger value="activity">Activity</TabsTrigger>
                        </TabsList>
                        <TabsContent value="comments">
                             <div className="space-y-4 mt-4">
                                <div className="relative">
                                    <Textarea 
                                        placeholder="Add a comment..." 
                                        className="pr-12"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendComment(commentText); } }}
                                    />
                                    <Button size="icon" className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => handleSendComment(commentText)}>
                                        <Send className="h-4 w-4"/>
                                        <span className="sr-only">Send Comment</span>
                                    </Button>
                                </div>
                                
                                {rootComments && rootComments.length > 0 ? (
                                    <div className="space-y-4">
                                        {rootComments.map((comment) => (
                                            <CommentItem
                                                key={comment.id}
                                                comment={comment}
                                                allComments={task.comments || []}
                                                onReply={(parentId, text) => handleSendComment(text, parentId)}
                                                onEdit={handleEditComment}
                                                onDelete={handleDeleteComment}
                                                onAddReaction={handleAddReaction}
                                                currentUserId={currentUserId}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center rounded-lg border border-dashed h-full">
                                        <MessageSquare className="h-10 w-10 text-muted-foreground/30" />
                                        <p className="mt-2 text-sm text-muted-foreground">No comments yet.</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                        <TabsContent value="activity">
                             <div className="space-y-6 mt-4">
                                {sortedActivity && sortedActivity.length > 0 ? (
                                    sortedActivity.map(activity => {
                                    const activityUser = users.find(u => u.id === activity.userId);
                                    return (
                                    <div key={activity.id} className="flex items-start gap-4">
                                        <Avatar className="h-8 w-8 mt-1">
                                            <AvatarImage src={activityUser?.avatarUrl} data-ai-hint="person portrait" />
                                            <AvatarFallback>{activityUser?.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 text-sm">
                                        <p className="break-words">{activity.details}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                                        </p>
                                        </div>
                                    </div>
                                    )
                                })
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center rounded-lg border-dashed">
                                        <Clock className="h-10 w-10 text-muted-foreground/30" />
                                        <p className="mt-2 text-sm text-muted-foreground">No activity yet.</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Column: Details */}
                <div className="md:col-span-1 space-y-6 p-6 bg-muted/30 border-l">
                     <div className="space-y-4 rounded-lg">
                          <DetailRow icon={CheckCircle} label="Status" isEditing={isEditing}>
                              {isEditing ? (
                                <Select value={currentTask.status} onValueChange={(v) => handleFieldChange('status', v as Task['status'])}>
                                  <SelectTrigger className="h-8 bg-background">
                                    <SelectValue/>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="todo">To Do</SelectItem>
                                    <SelectItem value="inprogress">In Progress</SelectItem>
                                    <SelectItem value="done">Done</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Badge className={cn("text-white", statusClasses[task.status])}>
                                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                </Badge>
                              )}
                          </DetailRow>

                          <DetailRow icon={Flag} label="Priority" isEditing={isEditing}>
                             {isEditing ? (
                                <Select value={currentTask.priority} onValueChange={(v) => handleFieldChange('priority', v as TaskPriority)}>
                                    <SelectTrigger className="h-8 bg-background">
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>
                              ) : (
                                <span className={cn("font-medium", priorityClasses[task.priority])}>
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                </span>
                              )}
                          </DetailRow>

                           <DetailRow icon={Folder} label="Project" isEditing={isEditing}>
                              {isEditing ? (
                                <Combobox
                                    options={projectOptions}
                                    value={currentTask.projectId || ''}
                                    onValueChange={(v) => handleFieldChange('projectId', v)}
                                    placeholder="Select a project"
                                    searchPlaceholder="Search projects..."
                                    emptyResult="No projects found."
                                    className="bg-background h-8"
                                />
                              ) : project ? (
                                <div className="flex items-center gap-2">
                                    <ProjectIcon className="h-4 w-4 text-muted-foreground" />
                                    <span>{project.name}</span>
                                </div>
                              ) : ( <span>No Project</span>)}
                          </DetailRow>

                          <DetailRow icon={Calendar} label="Deadline" isEditing={isEditing}>
                             {isEditing ? (
                                 <DatePicker
                                    date={currentTask.deadline}
                                    setDate={(d) => handleFieldChange('deadline', d)}
                                    className="bg-background h-8"
                                 />
                             ) : (
                                currentTask.deadline ? format(currentTask.deadline, "PPP") : 'No deadline'
                             )}
                          </DetailRow>

                          <DetailRow icon={UserIcon} label="Assignees" isEditing={isEditing}>
                              {isEditing ? (
                                <MultiSelectCombobox
                                    options={userOptions}
                                    selected={currentTask.assigneeIds || []}
                                    onSelectedChange={(v) => handleFieldChange('assigneeIds', v)}
                                    placeholder="Select assignees"
                                    searchPlaceholder="Search assignees..."
                                    emptyResult="No assignees found."
                                    className="bg-background"
                                />
                              ) : assignees.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                  {assignees.map(assignee => (
                                    <div key={assignee.id} className="flex items-center gap-2">
                                      <Avatar className="h-6 w-6">
                                        <AvatarImage src={assignee.avatarUrl} alt={assignee.name} data-ai-hint="person portrait"/>
                                        <AvatarFallback>
                                            {assignee.name.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span>{assignee.name}</span>
                                    </div>
                                  ))}
                                </div>
                              ): (<span>Not assigned</span>)}
                          </DetailRow>

                           <DetailRow icon={TagIcon} label="Tags" isEditing={isEditing}>
                              {isEditing ? (
                                 <MultiSelectCombobox
                                    options={tagOptions}
                                    selected={currentTask.tagIds || []}
                                    onSelectedChange={(v) => handleFieldChange('tagIds', v)}
                                    placeholder="Select tags"
                                    searchPlaceholder="Search tags..."
                                    emptyResult="No tags found."
                                    className="bg-background"
                                />
                              ) : taskTags.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {taskTags.map((tag) => (
                                  <Badge key={tag.id} variant="outline" className={cn("text-xs", tag.color)}>
                                      {tag.name}
                                  </Badge>
                                  ))}
                               </div>
                              ) : (<span>No tags</span>) }
                          </DetailRow>
                      </div>
                </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
