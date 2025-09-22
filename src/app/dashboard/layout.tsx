import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { tasks as initialTasks, projects as initialProjects, tags as initialTags } from "@/lib/data";
import { Project, Tag, Task } from "@/lib/types";
import React from "react";


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [projects, setProjects] = React.useState<Project[]>(initialProjects);
    const [tags, setTags] = React.useState<Tag[]>(initialTags);
    const [tasks, setTasks] = React.useState<Task[]>(initialTasks);

    // Dummy handlers for sidebar functionality
    const handleCreateProject = () => {};
    const handleEditProject = (project: Project) => {};
    const handleDeleteProject = (project: Project) => {};

    return (
        <SidebarProvider>
            <AppSidebar
                projects={projects}
                onNewProjectClick={handleCreateProject}
                onEditProject={handleEditProject}
                onDeleteProject={handleDeleteProject}
            />
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
