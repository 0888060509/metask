
"use client";

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { users } from "@/lib/data";
import { ListFilter, Search, X } from "lucide-react";
import type { TaskPriority, Project } from '@/lib/types';

type KanbanToolbarProps = {
  filters: {
    projects: string[];
    assignees: string[];
    priorities: TaskPriority[];
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    projects: string[];
    assignees: string[];
    priorities: TaskPriority[];
  }>>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  projects: Project[];
  showProjectFilter?: boolean;
};

const priorities: TaskPriority[] = ["high", "medium", "low"];

export function KanbanToolbar({ filters, setFilters, searchQuery, setSearchQuery, projects, showProjectFilter = true }: KanbanToolbarProps) {

  const handleFilterChange = (category: keyof typeof filters, value: string) => {
    setFilters(prev => {
      const currentCategory = prev[category] as string[];
      const newValue = currentCategory.includes(value)
        ? currentCategory.filter(item => item !== value)
        : [...currentCategory, value];
      return { ...prev, [category]: newValue };
    });
  };

  const clearFilters = () => {
    setFilters({ projects: [], assignees: [], priorities: [] });
  };
  
  const hasActiveFilters = (showProjectFilter && filters.projects.length > 0) || filters.assignees.length > 0 || filters.priorities.length > 0;

  return (
    <div className="flex items-center justify-between gap-4 border-b bg-background/95 px-4 py-3 backdrop-blur-sm sm:px-6">
       <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search tasks..." 
                className="pl-8" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        
       <div className="flex items-center gap-2">
        {showProjectFilter && <ListFilter className="h-4 w-4 text-muted-foreground" />}
        {showProjectFilter && <span className="text-sm font-medium text-muted-foreground hidden sm:inline">Filters:</span>}

        {showProjectFilter && (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className={filters.projects.length > 0 ? "border-primary text-primary hover:text-primary" : ""}>
                    Project {filters.projects.length > 0 && `(${filters.projects.length})`}
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                <DropdownMenuLabel>Filter by Project</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {projects.map((project) => (
                    <DropdownMenuCheckboxItem
                    key={project.id}
                    checked={filters.projects.includes(project.id)}
                    onCheckedChange={() => handleFilterChange("projects", project.id)}
                    >
                    {project.name}
                    </DropdownMenuCheckboxItem>
                ))}
                </DropdownMenuContent>
            </DropdownMenu>
        )}

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={filters.assignees.length > 0 ? "border-primary text-primary hover:text-primary" : ""}>
                Assignee {filters.assignees.length > 0 && `(${filters.assignees.length})`}
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by Assignee</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {users.map((user) => (
                <DropdownMenuCheckboxItem
                key={user.id}
                checked={filters.assignees.includes(user.id)}
                onCheckedChange={() => handleFilterChange("assignees", user.id)}
                >
                {user.name}
                </DropdownMenuCheckboxItem>
            ))}
            </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={filters.priorities.length > 0 ? "border-primary text-primary hover:text-primary" : ""}>
                Priority {filters.priorities.length > 0 && `(${filters.priorities.length})`}
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {priorities.map(priority => (
                    <DropdownMenuCheckboxItem 
                        key={priority}
                        checked={filters.priorities.includes(priority)}
                        onCheckedChange={() => handleFilterChange("priorities", priority)}
                    >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
        
        {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="hidden sm:inline-flex">
                <X className="mr-2 h-4 w-4 text-muted-foreground"/>
                Clear
            </Button>
        )}
       </div>
    </div>
  );
}
