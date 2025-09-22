"use client";

import React from "react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { tags as initialTags, tasks as initialTasks } from "@/lib/data";
import { Tag } from "@/lib/types";
import { TagsDataTable } from "@/components/tags/tags-data-table";
import { TagDialog } from "@/components/tags/tag-dialog";

export default function TagsPage() {
    const [tags, setTags] = React.useState<Tag[]>(initialTags);
    const [tasks, setTasks] = React.useState(initialTasks);
    const [isTagDialogOpen, setIsTagDialogOpen] = React.useState(false);
    const [selectedTag, setSelectedTag] = React.useState<Tag | null>(null);

    const handleCreateTag = () => {
        setSelectedTag(null);
        setIsTagDialogOpen(true);
    };

    const handleEditTag = (tag: Tag) => {
        setSelectedTag(tag);
        setIsTagDialogOpen(true);
    };

    const handleSaveTag = (tagData: { name: string; color: Tag['color'] }) => {
        if (selectedTag) {
            // Update existing tag
            setTags(tags.map(t => t.id === selectedTag.id ? { ...t, ...tagData } : t));
        } else {
            // Create new tag
            const newTag: Tag = {
                id: `tag-${Date.now()}`,
                name: tagData.name,
                color: tagData.color,
            };
            setTags([...tags, newTag]);
        }
    };

    const handleDeleteTag = (tagId: string) => {
        // Remove tag from the list of tags
        setTags(tags.filter(t => t.id !== tagId));
        
        // Remove tag from any tasks that have it
        setTasks(prevTasks => 
            prevTasks.map(task => {
                if (task.tagIds?.includes(tagId)) {
                    return {
                        ...task,
                        tagIds: task.tagIds.filter(id => id !== tagId)
                    };
                }
                return task;
            })
        );
    };

    return (
        <div className="flex h-full flex-col">
            <AppHeader
                title="Tags"
                onNewTaskClick={handleCreateTag}
                showCreateTask={false} // We will add a custom button
            />
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold font-headline">Manage Your Tags</h2>
                    <Button onClick={handleCreateTag}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Tag
                    </Button>
                </div>
                <div className="border shadow-sm rounded-lg">
                    <TagsDataTable 
                        data={tags}
                        onEdit={handleEditTag}
                        onDelete={handleDeleteTag}
                    />
                </div>
            </div>
            <TagDialog
                open={isTagDialogOpen}
                onOpenChange={setIsTagDialogOpen}
                onSave={handleSaveTag}
                tag={selectedTag}
            />
        </div>
    );
}
