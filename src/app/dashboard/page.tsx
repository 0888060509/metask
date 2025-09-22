
"use client";

import React from "react";
import { AppHeader } from "@/components/app-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { tasks as initialTasks, users as initialUsers } from "@/lib/data";
import { User, Task } from "@/lib/types";
import { WorkloadDistributionChart } from "@/components/dashboard/workload-distribution-chart";
import { IndividualPerformanceMetrics } from "@/components/dashboard/individual-performance-metrics";

export default function DashboardPage() {
    const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
    const [users, setUsers] = React.useState<User[]>(initialUsers);

    return (
        <div className="flex h-full flex-col">
            <AppHeader title="Dashboard" />
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Workload Distribution</CardTitle>
                        <CardDescription>Visualize task distribution to ensure a balanced team workload.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <WorkloadDistributionChart users={users} tasks={tasks} />
                    </CardContent>
                </Card>

                <Card>
                     <CardHeader>
                        <CardTitle className="font-headline">Individual Performance</CardTitle>
                        <CardDescription>Analyze key metrics for each team member's performance.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <IndividualPerformanceMetrics users={users} tasks={tasks} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
