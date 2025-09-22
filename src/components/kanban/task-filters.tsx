import * as React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { users } from "@/lib/data";
import { ListFilter, X } from "lucide-react";
import type { Filters } from '@/app/page';
import type { TaskPriority, Project } from '@/lib/types';

type TaskFiltersProps = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  projects: Project[];
};

const priorities: TaskPriority[] = ["high", "medium", "low"];

export function TaskFilters({ filters, setFilters, projects }: TaskFiltersProps) {

  const handleFilterChange = (category: keyof Filters, value: string) => {
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
  
  const hasActiveFilters = filters.projects.length > 0 || filters.assignees.length > 0 || filters.priorities.length > 0;

  return (
    <div className="flex items-center gap-2 border-b bg-background/95 px-4 py-2 backdrop-blur-sm sm:px-6">
       <div className="flex items-center gap-2">
        <ListFilter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Filters:</span>
       </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={filters.projects.length > 0 ? "border-primary text-primary" : ""}>
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={filters.assignees.length > 0 ? "border-primary text-primary" : ""}>
            Assignee {filters.assignees.length > 0 && `(${filters.assignees.length})`}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
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
          <Button variant="outline" size="sm" className={filters.priorities.length > 0 ? "border-primary text-primary" : ""}>
            Priority {filters.priorities.length > 0 && `(${filters.priorities.length})`}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
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
        <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4 text-muted-foreground"/>
            Clear filters
        </Button>
      )}
    </div>
  );
}
