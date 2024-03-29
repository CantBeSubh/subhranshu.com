'use client'
import { ReactNode, useState } from "react";

type BentoGridProps = {
    children: ReactNode,
    rows: number,
    cols: number
}

type BentoCardProps = {
    row?: number;
    col?: number;
    children: ReactNode;
};

const BentoCard = (props: BentoCardProps) => {
    const { row, col, children } = props;
    const [cardClass] = useState(() => `col-span-${col ?? 1} row-span-${row ?? 1} backdrop-blur-3xl rounded-lg border-2 border-black flex items-center justify-center w-full h-full text-black cursor-pointer`)
    return (
        <div className={cardClass}>
            {children ?? 'PLACEHOLDER'}
        </div>
    );
};


const BentoGrid = (props: BentoGridProps) => {
    const { cols, rows, children } = props
    const gridClass = `grid grid-cols-${cols} grid-rows-${rows} gap-4 p-4 h-full w-full`
    return (
        <div className={gridClass}>
            {children}
        </div>
    )
}

export { BentoCard, BentoGrid };
