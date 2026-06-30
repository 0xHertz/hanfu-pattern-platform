import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cn } from "@/lib/utils"

function TabsRoot({
  className,
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs-root"
      className={cn("w-full", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium outline-none transition-all",
        "data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow-xs",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn(
        "mt-2 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
      {...props}
    />
  )
}

export const Tabs = TabsRoot
export { TabsList, TabsTrigger, TabsContent }
