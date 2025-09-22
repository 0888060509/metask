import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  LogOut,
  Plus,
  Search,
  Settings,
  User,
} from "lucide-react";
import { SidebarTrigger } from "./ui/sidebar";

type AppHeaderProps = {
  title: string;
  onNewTaskClick?: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  showSearch?: boolean;
  showCreateTask?: boolean;
};

export function AppHeader({ 
  title,
  onNewTaskClick, 
  searchQuery, 
  setSearchQuery,
  showSearch = false,
  showCreateTask = false,
}: AppHeaderProps) {
  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <SidebarTrigger className="md:hidden" />
        <div className="flex w-full items-center justify-between gap-4">
          <div className="hidden md:block">
              <h1 className="font-headline text-2xl font-bold">{title}</h1>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2">
            {showSearch && setSearchQuery && (
              <div className="relative w-full max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search tasks..." 
                  className="pl-8" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
            {showCreateTask && onNewTaskClick && (
              <Button onClick={onNewTaskClick} className="ml-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Task
              </Button>
            )}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                    <AvatarImage src="https://picsum.photos/seed/5/40/40" alt="User Avatar" data-ai-hint="woman smiling"/>
                    <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <User className="mr-2" />
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Settings className="mr-2" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LogOut className="mr-2" />
                    <span>Log out</span>
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
}
