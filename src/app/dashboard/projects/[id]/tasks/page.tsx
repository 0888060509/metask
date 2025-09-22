
"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import Link from 'next/link';

import { AppHeader } from "@/components/app-header";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { TaskDialog } from "@/components/kanban/task-dialog";
import { KanbanToolbar } from "@/components/kanban/kanban-toolbar";
import { projects, tasks as allTasks } from "@/lib/data";
import type { Task, TaskPriority, Project } from "@/lib/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardContext } from "../../../layout";

export type Filters = {
  assignees: string[];
  priorities: TaskPriority[];
  tags: string[];
};

function ProjectTabs({ projectId }: { projectId: string }) {
    return (
        <TabsList>
            <TabsTrigger value="dashboard" asChild>
                <Link href={`/dashboard/projects/${projectId}`}>Dashboard</Link>
            </TabsTrigger>
            <TabsTrigger value="tasks" asChild>
                <Link href={`/dashboard/projects/${projectId}/tasks`}>Tasks</Link>
            </TabsTrigger>
        </TabsList>
    );
}

function ProjectTasksClient({ project, projectTasks }: { project: Project, projectTasks: Task[] }) {
  const context = React.useContext(DashboardContext);
    
  if (!context) return null;
  const { setTasks, openTask, tags, projects: allProjects } = context;

  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = React.useState(false);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [filters, setFilters] = React.useState<Omit<Filters, 'projects'>>({
    assignees: [],
    priorities: [],
    tags: [],
  });
  
  const currentUserId = "user-1"; 

  // Task handlers
  const handleCreateTask = (newTask: Omit<Task, "id" | "status" | "comments" | "activity">) => {
    const taskWithId: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      status: "todo",
      comments: [],
      activity: [
        { id: `act-${Date.now()}`, userId: currentUserId, activityType: 'create', timestamp: new Date(), details: 'You created the task.' }
      ],
    };
    setTasks((prevTasks) => [...prevTasks, taskWithId]);
  };
  
  const filteredTasks = React.useMemo(() => {
    return projectTasks.filter((task) => {
      const searchMatch =
        searchQuery.trim() === "" ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const assigneeMatch =
        filters.assignees.length === 0 ||
        (task.assigneeIds && task.assigneeIds.some(id => filters.assignees.includes(id)));
      const priorityMatch =
        filters.priorities.length === 0 ||
        filters.priorities.includes(task.priority);
      const tagMatch =
        filters.tags.length === 0 ||
        (task.tagIds && task.tagIds.some(id => filters.tags.includes(id)));
      return searchMatch && assigneeMatch && priorityMatch && tagMatch;
    });
  }, [projectTasks, filters, searchQuery]);

  return (
    <div className="flex h-full flex-col">
       <div className="sticky top-0 z-10 bg-background">
          <AppHeader title={project.name} />
          <div className="border-b bg-background px-4 py-2">
              <Tabs value={'tasks'}>
                  <ProjectTabs projectId={project.id} />
              </Tabs>
          </div>
      </div>
      <KanbanToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={{...filters, projects: []}}
        setFilters={(newFilters) => {
            const {projects, ...rest} = newFilters;
            setFilters(rest);
        }}
        projects={[]}
        showProjectFilter={false}
      />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <KanbanBoard 
          tasks={filteredTasks} 
          setTasks={setTasks} 
          onTaskClick={openTask}
          projects={allProjects}
          onNewTaskClick={() => setIsNewTaskDialogOpen(true)}
        />
      </div>
      <TaskDialog
        open={isNewTaskDialogOpen}
        onOpenChange={setIsNewTaskDialogOpen}
        onSave={handleCreateTask}
        projects={allProjects}
        tags={tags}
        defaultProjectId={project.id}
      />
    </div>
  );
}

// This is the new Server Component wrapper
export default function ProjectTasksPage({ params }: { params: { id: string } }) {
    const project = projects.find(p => p.id === params.id);
    
    if (!project) {
        notFound();
    }
    const projectTasks = allTasks.filter(t => t.projectId === params.id);
  
    return <ProjectTasksClient project={project} projectTasks={projectTasks} />;
}
