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
import { Filter } from "lucide-react";

export function TaskFilters() {
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
            <DropdownMenuCheckboxItem key={project.id}>
              {project.name}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Filter by Assignee</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {users.map((user) => (
            <DropdownMenuCheckboxItem key={user.id}>
              {user.name}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem>High</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Medium</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Low</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Active filters can be displayed here */}
    </div>
  );
}
