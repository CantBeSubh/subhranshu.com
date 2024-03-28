import { ReactNode } from "react";

type BentoCardProps = {
    row?: number;
    col?: number;
    children: ReactNode;
};

const BentoCard = (props: BentoCardProps) => {
    const { row, col, children } = props;
    return (
        <div className={`col-span-${col ?? 1} row-span-${row ?? 1} backdrop-blur-3xl rounded-lg border-2 border-black flex items-center justify-center w-full h-full text-black cursor-pointer`}>
            {children ?? 'PLACEHOLDER'}
        </div>
    );
};

export default BentoCard