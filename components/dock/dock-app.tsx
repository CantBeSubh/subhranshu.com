'use client';
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type DockAppProps = {
    href: string,
    handleAppHover: (ev: React.MouseEvent<HTMLLIElement>) => void,
    isTargetBlank?: boolean,
    tooltip: string,
    children: ReactNode
}

export const DockApp = (props: DockAppProps) => {
    const { href, handleAppHover, tooltip, isTargetBlank, children } = props;

    const pathname = usePathname();

    return (
        <li className="app" onMouseMove={handleAppHover}>
            <Link
                href={href}
                className={cn("size-full block rounded-xl text-white", pathname !== href && "opacity-50")}
                target={isTargetBlank ? "_blank" : undefined}
            >
                {children}
                <span className="tooltip">{tooltip}</span>
            </Link>
        </li>
    );
};
