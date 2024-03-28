import { ReactNode } from "react"

type BentoGridProps = {
    children: ReactNode,
    rows: number,
    cols: number
}
export default function BentoGrid(props: BentoGridProps) {
    const { cols, rows, children } = props
    return (
        <div className={`grid grid-cols-${cols} grid-rows-${rows} gap-4 p-4 h-full w-full`}>
            {children}
        </div>
    )
}