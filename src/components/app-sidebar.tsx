"use client";

import { projects, users } from "@/lib/data";
import {
  Bell,
  Home,
  Settings,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

export function AppSidebar() {
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
              <CollapsibleTrigger asChild>
                 <Button variant="ghost" size="icon" className="h-6 w-6">
                    {isProjectsOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    <span className="sr-only">Toggle Projects</span>
                 </Button>
              </CollapsibleTrigger>
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
                {projects.map((project) => (
                  <SidebarMenuItem key={project.id}>
                    <SidebarMenuButton asChild>
                      <Link href="#">
                        <project.icon />
                        {project.name}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
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
