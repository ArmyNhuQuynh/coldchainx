import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export const SortableHeader = ( {
    column,
    children,
    className,
}: {
    column: any;
    children: React.ReactNode;
    className?: string;
} ) =>
{
    const sorted = column.getIsSorted();

    return (
        <div className={ cn( "flex justify-center items-center", className ) }>
            <Button
                variant="ghost"
                onClick={ () => column.toggleSorting( sorted === "asc" ) }
                className={ "hover:bg-muted/50 h-8 data-[state=open]:bg-accent" }
            >
                <span className="font-semibold text-base">{ children }</span>
                {/* Visual indicator for sorting state - shows all three states clearly */ }
                {
                    sorted === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : sorted === "desc" ? (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    ) : null
                }
            </Button >
        </div>
    );
};