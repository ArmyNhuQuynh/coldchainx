import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

function Tabs ( {
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Root> )
{
    return (
        <TabsPrimitive.Root
            data-slot="tabs"
            className={ cn( "flex flex-col", className ) }
            { ...props }
        />
    )
}

function TabsList ( {
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.List> )
{
    return (
        <TabsPrimitive.List
            data-slot="tabs-list"
            className={ cn(
                "inline-flex items-center justify-start border-b border-gray-200 bg-transparent p-0",
                className
            ) }
            { ...props }
        />
    )
}

function TabsTrigger ( {
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> )
{
    return (
        <TabsPrimitive.Trigger
            data-slot="tabs-trigger"
            className={ cn(
                "relative cursor-pointer  inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-primary whitespace-nowrap border-b-2 border-transparent data-[state=active]:border-primary bg-transparent",
                className
            ) }
            { ...props }
        />
    )
}

function TabsContent ( {
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Content> )
{
    return (
        <TabsPrimitive.Content
            data-slot="tabs-content"
            className={ cn( "mt-4 flex-1 outline-none", className ) }
            { ...props }
        />
    )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }