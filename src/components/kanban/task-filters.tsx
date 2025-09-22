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
import { projects, users } from "@/lib/data";
import { Filter, X } from "lucide-react";
import type { Filters } from '@/app/page';
import type { TaskPriority } from '@/lib/types';
import { Badge } from '../ui/badge';

type TaskFiltersProps = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
};

const priorities: TaskPriority[] = ["high", "medium", "low"];

export function TaskFilters({ filters, setFilters }: TaskFiltersProps) {
  const handleProjectCheckedChange = (projectId: string) => {
    setFilters((prev) => ({
      ...prev,
      projects: prev.projects.includes(projectId)
        ? prev.projects.filter((id) => id !== projectId)
        : [...prev.projects, projectId],
    }));
  };

  const handleAssigneeCheckedChange = (assigneeId: string) => {
    setFilters((prev) => ({
      ...prev,
      assignees: prev.assignees.includes(assigneeId)
        ? prev.assignees.filter((id) => id !== assigneeId)
        : [...prev.assignees, assigneeId],
    }));
  };

  const handlePriorityCheckedChange = (priority: TaskPriority) => {
    setFilters((prev) => ({
      ...prev,
      priorities: prev.priorities.includes(priority)
        ? prev.priorities.filter((p) => p !== priority)
        : [...prev.priorities, priority],
    }));
  };

  const clearFilters = () => {
    setFilters({ projects: [], assignees: [], priorities: [] });
  };
  
  const hasActiveFilters = filters.projects.length > 0 || filters.assignees.length > 0 || filters.priorities.length > 0;

  return (
    <div className="flex items-center gap-2 border-b bg-background/95 px-4 py-2 backdrop-blur-sm sm:px-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Filter by Project</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {projects.map((project) => (
            <DropdownMenuCheckboxItem
              key={project.id}
              checked={filters.projects.includes(project.id)}
              onCheckedChange={() => handleProjectCheckedChange(project.id)}
            >
              {project.name}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Filter by Assignee</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {users.map((user) => (
            <DropdownMenuCheckboxItem
              key={user.id}
              checked={filters.assignees.includes(user.id)}
              onCheckedChange={() => handleAssigneeCheckedChange(user.id)}
            >
              {user.name}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {priorities.map(priority => (
             <DropdownMenuCheckboxItem 
                key={priority}
                checked={filters.priorities.includes(priority)}
                onCheckedChange={() => handlePriorityCheckedChange(priority)}
             >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
             </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {hasActiveFilters && (
        <>
        <div className='flex items-center gap-2 flex-wrap'>
          {filters.projects.map(id => {
            const project = projects.find(p => p.id === id);
            return <Badge variant="secondary" key={id}>{project?.name}</Badge>
          })}
          {filters.assignees.map(id => {
            const user = users.find(u => u.id === id);
            return <Badge variant="secondary" key={id}>{user?.name}</Badge>
          })}
          {filters.priorities.map(priority => (
            <Badge variant="secondary" key={priority}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</Badge>
          ))}
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={clearFilters}>
            <X className="h-4 w-4 text-muted-foreground"/>
            <span className="sr-only">Clear filters</span>
        </Button>
        </>
      )}
    </div>
  );
}
