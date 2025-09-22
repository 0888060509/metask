"use client";

import {
  Bell,
  Home,
  Settings,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Tag,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "./ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import type { Project } from "@/lib/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { iconMap } from "./project/icon-picker";


type AppSidebarProps = {
    projects: Project[];
    onNewProjectClick: () => void;
    onEditProject: (project: Project) => void;
    onDeleteProject: (project: Project) => void;
}

export function AppSidebar({ projects, onNewProjectClick, onEditProject, onDeleteProject }: AppSidebarProps) {
  const [isProjectsOpen, setIsProjectsOpen] = React.useState(true);
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-6 w-6 text-primary"><rect width="256" height="256" fill="none"/><path d="M128,24a104,104,0,1,0,104,104A104.11,104.11,0,0,0,128,24Zm-4.22,108.22L112,144a8,8,0,0,1-16,0l-16-40a8,8,0,0,1,14.06-7.06L112,128l18.06-31.06a8,8,0,0,1,14.06,0l40,68.57a8,8,0,0,1-6.73,12.27H139.31L123.78,132.22Z"/></svg>
            <h1 className="font-headline text-xl font-bold">Metask Lite</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
              <Link href="/dashboard">
                <Home />
                Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname.startsWith("/dashboard/tags")}>
              <Link href="/dashboard/tags">
                <Tag />
                Tags
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="#">
                <Bell />
                Notifications
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarGroup>
          <Collapsible open={isProjectsOpen} onOpenChange={setIsProjectsOpen}>
            <div className="flex items-center justify-between">
              <SidebarGroupLabel>Projects</SidebarGroupLabel>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onNewProjectClick}>
                    <Plus className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Create Project</span>
                 </Button>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                      {isProjectsOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                      <span className="sr-only">Toggle Projects</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
            <CollapsibleContent>
              <SidebarMenu>
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/"}>
                        <Link href="/">
                            <LayoutGrid />
                            All Tasks
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                {projects.map((project) => {
                  const Icon = iconMap[project.icon as keyof typeof iconMap] || iconMap.FileText;
                  return (
                  <SidebarMenuItem key={project.id}>
                    <div className="flex items-center w-full">
                        <SidebarMenuButton asChild className="flex-1">
                            <Link href="#">
                                <Icon />
                                {project.name}
                            </Link>
                        </SidebarMenuButton>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 opacity-0 group-hover/menu-item:opacity-100">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEditProject(project)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDeleteProject(project)} className="text-red-600 focus:text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                  </SidebarMenuItem>
                )})}
              </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
         <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="#">
                <Settings />
                Settings
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
