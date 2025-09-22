
"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { users } from "@/lib/data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function SettingsPage() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [emailNotifications, setEmailNotifications] = React.useState(true);

  // This would be the ID of the currently logged-in user.
  const currentUserId = "user-4"
  const currentUser = users.find((user) => user.id === currentUserId)
  
  React.useEffect(() => {
    setMounted(true)
  }, [])


  return (
    <div className="flex h-full flex-col">
      <AppHeader title="Settings" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto grid max-w-4xl gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Profile</CardTitle>
              <CardDescription>
                This is how others will see you on the site.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center space-x-4">
                 <Avatar className="h-20 w-20">
                    <AvatarImage src={currentUser?.avatarUrl} alt={currentUser?.name} data-ai-hint="person portrait"/>
                    <AvatarFallback>{currentUser?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Photo</Button>
               </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={currentUser?.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={currentUser?.email} />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Save</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                {mounted && (
                    <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger id="theme">
                            <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                    </Select>
                )}
              </div>
            </CardContent>
          </Card>
          
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
                            <Label htmlFor="notification-email">Email for updates</Label>
                            <Input id="notification-email" type="email" defaultValue={currentUser?.email} placeholder="Enter email for notifications"/>
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
            <CardFooter className="border-t px-6 py-4">
                <Button>Save</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
