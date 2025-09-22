import { AppHeader } from "@/components/app-header";

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col">
       <AppHeader title="Dashboard" />
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Dashboard for reports and statistics will be here.</p>
      </div>
    </div>
  );
}
