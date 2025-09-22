
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
import {
  LogOut,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { SidebarTrigger } from "./ui/sidebar";

type AppHeaderProps = {
  title: string;
  children?: React.ReactNode;
};

export function AppHeader({ 
  title,
  children,
}: AppHeaderProps) {
  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <SidebarTrigger className="md:hidden" />
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex items-center gap-4">
              <h1 className="font-headline text-2xl font-bold hidden md:block">{title}</h1>
              {children}
          </div>
          <div className="flex flex-1 items-center justify-end gap-2">
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
                <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                        <Settings className="mr-2" />
                        <span>Settings</span>
                    </Link>
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
