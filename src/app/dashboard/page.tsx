import { AppHeader } from "@/components/app-header";

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col">
       <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <div className="flex w-full items-center justify-between">
            <div className="hidden md:block">
                <h1 className="font-headline text-2xl font-bold">Dashboard</h1>
            </div>
        </div>
      </header>
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Dashboard for reports and statistics will be here.</p>
      </div>
    </div>
  );
}
