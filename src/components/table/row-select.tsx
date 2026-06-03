import type { Row, Table } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";

export const RowSelectHeader = ( {
    table,
    className,
}: {
    table: Table<any>;
    className?: string;
} ) =>
{
    return (
        <Checkbox
            className={ className }
            checked={
                table.getIsAllPageRowsSelected() ||
                ( table.getIsSomePageRowsSelected() && "indeterminate" )
            }
            onCheckedChange={ ( value ) => table.toggleAllPageRowsSelected( !!value ) }
            aria-label="Select all"
        />
    );
}

export const RowSelectCell = ( {
    row,
    className,
}: {
    row: Row<any>,
    className?: string;
} ) =>
{
    return (
        <Checkbox
            className={ className }
            checked={ row.getIsSelected() }
            onCheckedChange={ ( value ) => row.toggleSelected( !!value ) }
            aria-label="Select row"
        />
    );
}