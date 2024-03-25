'use client'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { MapPin } from "@phosphor-icons/react/dist/ssr";
import moment from "moment";
import { useEffect, useState } from "react";

export const Time = () => {
    const [time, setTime] = useState(moment());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(moment());
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, []);
    const formattedTime = time.format('HH:mm:ss');

    return (
        <div className="font-thin w-fit absolute top-4 left-4 z-50 text-white">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        {formattedTime}
                    </TooltipTrigger>
                    <TooltipContent className="bg-black/10 pt-2 rounded-none border-none text-neutral-400 text-sm font-thin uppercase">
                        <MapPin weight="duotone" className="inline mr-1 -mt-1" /> New Delhi, IN
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};


