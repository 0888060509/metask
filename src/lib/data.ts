import type { User, Project, Task, Tag } from "./types";

export const users: User[] = [
  { id: "user-1", name: "Sarah Lee", avatarUrl: "https://picsum.photos/seed/1/40/40", email: "sarah@example.com" },
  { id: "user-2", name: "Mike Johnson", avatarUrl: "https://picsum.photos/seed/2/40/40", email: "mike@example.com" },
  { id: "user-3", name: "Emily Chen", avatarUrl: "https://picsum.photos/seed/3/40/40", email: "emily@example.com" },
  { id: "user-4", name: "David Rodriguez", avatarUrl: "https://picsum.photos/seed/4/40/40", email: "david@example.com" },
];

export const projects: Project[] = [
  { id: "proj-1", name: "Website Redesign", icon: "FileText" },
  { id: "proj-2", name: "Mobile App", icon: "Package" },
  { id: "proj-3", name: "Marketing Campaign", icon: "BarChart2" },
  { id: "proj-4", name: "Team Onboarding", icon: "Users" },
];

export const tags: Tag[] = [
    { id: 'tag-1', name: 'design', color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400' },
    { id: 'tag-2', name: 'ui/ux', color: 'bg-pink-500/10 text-pink-700 dark:text-pink-400' },
    { id: 'tag-3', name: 'development', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400' },
    { id: 'tag-4', name: 'auth', color: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' },
    { id: 'tag-5', name: 'marketing', color: 'bg-orange-500/10 text-orange-700 dark:text-orange-400' },
    { id: 'tag-6', name: 'content', color: 'bg-teal-500/10 text-teal-700 dark:text-teal-400' },
    { id: 'tag-7', name: 'devops', color: 'bg-gray-500/10 text-gray-700 dark:text-gray-400' },
    { id: 'tag-8', name: 'copywriting', color: 'bg-lime-500/10 text-lime-700 dark:text-lime-400' },
    { id: 'tag-9', name: 'research', color: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400' },
    { id: 'tag-10', name: 'bug', color: 'bg-red-500/10 text-red-700 dark:text-red-400' },
    { id: 'tag-11', name: 'mobile', color: 'bg-sky-500/10 text-sky-700 dark:text-sky-400' },
]

export const tasks: Task[] = [
  {
    id: "task-1",
    title: "Design homepage mockups",
    description: "Create high-fidelity mockups for the new website homepage.",
    status: "inprogress",
    priority: "high",
    deadline: new Date(new Date().setDate(new Date().getDate() + 3)),
    assigneeId: "user-1",
    projectId: "proj-1",
    tagIds: ["tag-1", "tag-2"],
    comments: [
      { id: 'comment-1', taskId: 'task-1', userId: 'user-2', text: "How's this going?", createdAt: new Date(new Date().setDate(new Date().getDate() - 1)) },
      { id: 'comment-2', taskId: 'task-1', userId: 'user-1', text: "Almost done, will share soon.", createdAt: new Date() },
    ],
    activity: [
      { id: 'act-1', userId: 'user-2', activityType: 'comment', timestamp: new Date(new Date().setDate(new Date().getDate() - 1)), details: 'Mike Johnson added a comment.' },
      { id: 'act-2', userId: 'user-1', activityType: 'comment', timestamp: new Date(), details: 'Sarah Lee added a comment.' },
      { id: 'act-3', userId: 'user-4', activityType: 'status_change', timestamp: new Date(new Date().setDate(new Date().getDate() - 2)), details: 'David Rodriguez changed status from To Do to In Progress.' },
      { id: 'act-4', userId: 'user-4', activityType: 'create', timestamp: new Date(new Date().setDate(new Date().getDate() - 3)), details: 'David Rodriguez created the task.' },
    ],
  },
  {
    id: "task-2",
    title: "Develop login functionality",
    description: "Implement JWT-based authentication for the mobile app.",
    status: "inprogress",
    priority: "high",
    deadline: new Date(new Date().setDate(new Date().getDate() + 5)),
    assigneeId: "user-3",
    projectId: "proj-2",
    tagIds: ["tag-3", "tag-4"],
    comments: [],
    activity: [
        { id: 'act-5', userId: 'user-3', activityType: 'create', timestamp: new Date(new Date().setDate(new Date().getDate() - 4)), details: 'Emily Chen created the task.' },
    ]
  },
  {
    id: "task-3",
    title: "Plan social media content",
    description: "Outline content calendar for the next month's marketing campaign.",
    status: "todo",
    priority: "medium",
    deadline: new Date(new Date().setDate(new Date().getDate() + 7)),
    assigneeId: "user-2",
    projectId: "proj-3",
    tagIds: ["tag-5", "tag-6"],
    comments: [],
    activity: [
        { id: 'act-6', userId: 'user-2', activityType: 'create', timestamp: new Date(new Date().setDate(new Date().getDate() - 1)), details: 'Mike Johnson created the task.' },
    ]
  },
  {
    id: "task-4",
    title: "Finalize homepage design",
    description: "Incorporate feedback and finalize the homepage design.",
    status: "done",
    priority: "high",
    deadline: new Date(new Date().setDate(new Date().getDate() - 2)),
    assigneeId: "user-1",
    projectId: "proj-1",
    tagIds: ["tag-1", "tag-2"],
    comments: [],
    activity: [
        { id: 'act-7', userId: 'user-1', activityType: 'status_change', timestamp: new Date(new Date().setDate(new Date().getDate() - 2)), details: 'Sarah Lee changed status from In Progress to Done.' },
        { id: 'act-8', userId: 'user-1', activityType: 'create', timestamp: new Date(new Date().setDate(new Date().getDate() - 6)), details: 'Sarah Lee created the task.' },
    ]
  },
  {
    id: "task-5",
    title: "Setup CI/CD pipeline",
    status: "todo",
    priority: "medium",
    assigneeId: "user-3",
    projectId: "proj-2",
    tagIds: ["tag-7", "tag-3"],
    comments: [],
    activity: [
        { id: 'act-9', userId: 'user-3', activityType: 'create', timestamp: new Date(new Date().setDate(new Date().getDate() - 2)), details: 'Emily Chen created the task.' },
    ]
  },
  {
    id: "task-6",
    title: "Create ad copy for social media",
    status: "todo",
    priority: "low",
    deadline: new Date(new Date().setDate(new Date().getDate() + 10)),
    assigneeId: "user-2",
    projectId: "proj-3",
    tagIds: ["tag-5", "tag-8"],
    comments: [],
    activity: []
  },
  {
    id: "task-7",
    title: "User testing for prototype",
    description: "Conduct user testing sessions for the website prototype.",
    status: "done",
    priority: "medium",
    deadline: new Date(new Date().setDate(new Date().getDate() - 5)),
    assigneeId: "user-4",
    projectId: "proj-1",
    tagIds: ["tag-9", "tag-2"],
    comments: [],
    activity: []
  },
  {
    id: "task-8",
    title: "Fix push notification bug",
    description: "Investigate and fix the bug where push notifications are not being delivered on Android.",
    status: "inprogress",
    priority: "high",
    deadline: new Date(new Date().setDate(new Date().getDate() + 1)),
    assigneeId: "user-3",
    projectId: "proj-2",
    tagIds: ["tag-10", "tag-11"],
    comments: [],
    activity: []
  },
];
