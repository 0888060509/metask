import { cn } from "@/lib/utils";

export function DetailRow({
  icon: Icon,
  label,
  children,
  isEditing,
  className,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  isEditing?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-3 items-start gap-4", className)}>
      <div className="flex col-span-1 items-center gap-2 text-sm font-medium text-muted-foreground pt-2">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <div className={cn("col-span-2 text-sm", isEditing ? "" : "pt-2")}>{children}</div>
    </div>
  );
}
