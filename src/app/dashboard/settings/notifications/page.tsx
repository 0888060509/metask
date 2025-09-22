
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export default function NotificationSettingsPage() {
    const [emailNotifications, setEmailNotifications] = React.useState(true)

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Notifications</CardTitle>
                <CardDescription>
                    Configure how you receive notifications.
                </CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border">
                <div className="py-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive notifications via email.</p>
                        </div>
                        <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications}/>
                    </div>
                    {emailNotifications && (
                        <div className="space-y-2 pt-4">
                            <p className="text-sm text-muted-foreground">Email for updates will use the same users' mail</p>
                        </div>
                    )}
                </div>
                 <div className="flex items-center justify-between py-4">
                    <div>
                        <p className="font-medium">Task Assignments</p>
                        <p className="text-sm text-muted-foreground">Notify me when I'm assigned to a new task.</p>
                    </div>
                    <Switch defaultChecked/>
                </div>
                 <div className="flex items-center justify-between py-4">
                    <div>
                        <p className="font-medium">New Comments</p>
                        <p className="text-sm text-muted-foreground">Notify me when someone comments on my tasks.</p>
                    </div>
                    <Switch defaultChecked/>
                </div>
            </CardContent>
            <CardFooter>
                <Button>Save Notifications</Button>
            </CardFooter>
        </Card>
    )
}
