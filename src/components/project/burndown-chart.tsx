
"use client"

import * as React from "react"
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"
import type { Task } from "@/lib/types"
import { differenceInDays, startOfDay } from "date-fns"

type BurndownChartProps = {
  projectTasks: Task[]
}

const chartConfig = {
  ideal: {
    label: "Ideal Progress",
    color: "hsl(var(--chart-1))",
  },
  actual: {
    label: "Actual Progress",
    color: "hsl(var(--chart-2))",
  },
}

export function BurndownChart({ projectTasks }: BurndownChartProps) {
    const chartData = React.useMemo(() => {
        if (!projectTasks.length) return [];

        const allDates = projectTasks.flatMap(t => [
            t.activity?.find(a => a.activityType === 'create')?.timestamp, 
            t.activity?.find(a => a.activityType === 'status_change' && (a.details.includes('to Done') || a.details.includes('to done')))?.timestamp
        ]).filter(Boolean).map(d => startOfDay(d!));
        
        const projectStartDate = allDates.length ? new Date(Math.min(...allDates.map(d => d.getTime()))) : startOfDay(new Date());
        let projectEndDate = allDates.length ? new Date(Math.max(...allDates.map(d => d.getTime()))) : startOfDay(new Date());

        // Ensure end date is not in the past if tasks are still open
        if (projectTasks.some(t => t.status !== 'done')) {
            const today = startOfDay(new Date());
            if (projectEndDate < today) {
                projectEndDate = today;
            }
        }


        const totalTasks = projectTasks.length;
        const durationInDays = differenceInDays(projectEndDate, projectStartDate) + 1;

        const tasksCompletedByDate: { [key: string]: number } = {};
        projectTasks.forEach(task => {
            if (task.status === 'done') {
                const completionActivity = task.activity?.slice().reverse().find(a => a.activityType === 'status_change' && a.details.toLowerCase().includes('to done'));
                if (completionActivity) {
                    const completionDate = startOfDay(completionActivity.timestamp).toISOString().split('T')[0];
                    tasksCompletedByDate[completionDate] = (tasksCompletedByDate[completionDate] || 0) + 1;
                }
            }
        });

        const data = [];
        let actualRemaining = totalTasks;
        let cumulativeCompleted = 0;

        for (let i = 0; i < durationInDays; i++) {
            const date = new Date(projectStartDate);
            date.setDate(projectStartDate.getDate() + i);
            const dateString = date.toISOString().split('T')[0];

            const idealRemaining = Math.max(0, totalTasks - (totalTasks / (durationInDays -1 < 1 ? 1 : durationInDays - 1 )) * i);
            
            cumulativeCompleted += tasksCompletedByDate[dateString] || 0;
            actualRemaining = totalTasks - cumulativeCompleted;

            data.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                ideal: parseFloat(idealRemaining.toFixed(2)),
                actual: actualRemaining,
            });
        }
        return data;

    }, [projectTasks]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Burndown Chart</CardTitle>
        <CardDescription>Track actual work progress against the set plan.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
             <YAxis 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                label={{ value: 'Tasks Remaining', angle: -90, position: 'insideLeft', offset: -10, style: { textAnchor: 'middle' } }}
            />
            <Tooltip
              content={<ChartTooltipContent indicator="line" />}
            />
             <Legend content={<ChartLegendContent />} />
            <Line
              dataKey="ideal"
              type="monotone"
              stroke="var(--color-ideal)"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
            />
            <Line
              dataKey="actual"
              type="monotone"
              stroke="var(--color-actual)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
