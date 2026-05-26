import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { SelectSingleEventHandler } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import
{
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import
{
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useMemo } from "react";

interface DateTimePickerProps
{
    date?: Date;
    setDate: ( date: Date | undefined ) => void; // Allow setting to undefined
    placeholder?: string;
    disabled?: boolean;
    fromDate?: Date;
    toDate?: Date;
}

export function DateTimePicker ( { date, setDate, placeholder, disabled, fromDate, toDate }: DateTimePickerProps )
{
    const handleDateSelect: SelectSingleEventHandler = ( _, selected ) =>
    {
        // Get the time from the currently selected date, or default to 00:00
        const hour = date?.getHours() || 0;
        const minute = date?.getMinutes() || 0;

        if ( !selected )
        {
            setDate( undefined );
            return;
        }

        const newDate = new Date( selected );
        newDate.setHours( hour );
        newDate.setMinutes( minute );

        setDate( newDate );
    };

    const handleTimeChange = ( value: string, type: 'hour' | 'minute' ) =>
    {
        // If no date is set, default to today's date
        const newDate = date ? new Date( date ) : new Date();
        const numericValue = parseInt( value, 10 );

        if ( type === 'hour' )
        {
            newDate.setHours( numericValue );
        } else
        {
            newDate.setMinutes( numericValue );
        }

        setDate( newDate );
    };

    // Memoize options to prevent re-rendering on every update
    const hourOptions = useMemo( () =>
        Array.from( { length: 24 }, ( _, i ) => String( i ).padStart( 2, '0' ) )
        , [] );

    const minuteOptions = useMemo( () =>
        Array.from( { length: 60 }, ( _, i ) => String( i ).padStart( 2, '0' ) )
        , [] );


    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={ "outline" }
                    className={ cn(
                        "w-[280px] justify-start text-left font-normal bg-card",
                        !date && "text-muted-foreground"
                    ) }
                    disabled={ disabled }
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {/* Update the format to include time */ }
                    { date ? format( date, "dd/MM/yyyy HH:mm" ) : <span>{ placeholder ?? "Chọn ngày và giờ" }</span> }
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    captionLayout="dropdown"
                    mode="single"
                    selected={ date }
                    onSelect={ handleDateSelect }
                    initialFocus
                    locale={ vi }
                    disabled={ ( date ) =>
                        ( fromDate ? date < fromDate : false ) ||
                        ( toDate ? date > toDate : false )
                    }
                />
                {/* Add Time selection inputs below the calendar */ }
                <div className="p-3 border-t border-border flex items-center justify-center gap-2">
                    <Select
                        value={ String( date?.getHours() || 0 ).padStart( 2, '0' ) }
                        onValueChange={ ( value ) => handleTimeChange( value, 'hour' ) }
                        disabled={ !date || disabled }
                    >
                        <SelectTrigger className="w-[80px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            { hourOptions.map( hour => (
                                <SelectItem key={ hour } value={ hour }>{ hour }</SelectItem>
                            ) ) }
                        </SelectContent>
                    </Select>
                    :
                    <Select
                        value={ String( date?.getMinutes() || 0 ).padStart( 2, '0' ) }
                        onValueChange={ ( value ) => handleTimeChange( value, 'minute' ) }
                        disabled={ !date || disabled }
                    >
                        <SelectTrigger className="w-[80px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            { minuteOptions.map( minute => (
                                <SelectItem key={ minute } value={ minute }>{ minute }</SelectItem>
                            ) ) }
                        </SelectContent>
                    </Select>
                </div>
            </PopoverContent>
        </Popover>
    );
}