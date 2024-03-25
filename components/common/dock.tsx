'use client'
import { scaleValue } from "@/components/utils/scale";
import { cn } from "@/lib/utils";
import { ArticleMedium, Browsers, Flask, House, Notebook, TwitterLogo, User } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";

const maxAdditionalSize = 5;

function Dock() {
    const dockRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname()

    const handleAppHover = (ev: React.MouseEvent<HTMLLIElement>) => {
        if (!dockRef.current) return;

        const mousePosition = ev.clientX;
        const iconPositionLeft = ev.currentTarget.getBoundingClientRect().left;
        const iconWidth = ev.currentTarget.getBoundingClientRect().width;

        const cursorDistance = (mousePosition - iconPositionLeft) / iconWidth;
        const offsetPixels = scaleValue(
            cursorDistance,
            [0, 1],
            [maxAdditionalSize * -1, maxAdditionalSize]
        );

        dockRef.current.style.setProperty(
            "--dock-offset-left",
            `${offsetPixels * -1}px`
        );

        dockRef.current.style.setProperty(
            "--dock-offset-right",
            `${offsetPixels}px`
        );
    };

    return (
        <div className="page">
            <nav ref={dockRef} className="dock">
                <ul>
                    <li className="app" onMouseMove={handleAppHover}>
                        <Link
                            href="/"
                            className={cn("size-full block rounded-xl text-white", pathname !== "/" && "opacity-50")}
                        >
                            <House size={32} weight="duotone" className="size-full p-2" />
                            <span className="tooltip">Home</span>
                        </Link>
                    </li>
                    <li className="app" onMouseMove={handleAppHover}>
                        <Link
                            href="/about"
                            className={cn("size-full block rounded-xl text-white", pathname !== "/about" && "opacity-50")}
                        >
                            <User size={32} weight="duotone" className="size-full p-2" />
                            <span className="tooltip">About</span>
                        </Link>
                    </li>
                    <li className="app" onMouseMove={handleAppHover}>
                        <Link
                            href="/projects"
                            className={cn("size-full block rounded-xl text-white", pathname !== "/projects" && "opacity-50")}
                        >
                            <Browsers size={32} weight="duotone" className="size-full p-2" />
                            <span className="tooltip">Projects</span>
                        </Link>
                    </li>
                    <li className="app" onMouseMove={handleAppHover}>
                        <Link
                            href="/labs"
                            className={cn("size-full block rounded-xl text-white", pathname !== "/labs" && "opacity-50")}
                        >
                            <Flask size={32} weight="duotone" className="size-full p-2" />
                            <span className="tooltip">Labs</span>
                        </Link>
                    </li>
                    <li className="app" onMouseMove={handleAppHover}>
                        <Link
                            href="/blogs"
                            className={cn("size-full block rounded-xl text-white", pathname !== "/blogs" && "opacity-50")}
                        >
                            <ArticleMedium size={32} weight="duotone" className="size-full p-2" />
                            <span className="tooltip">Blogs</span>
                        </Link>
                    </li>
                    <li className="app" onMouseMove={handleAppHover}>
                        <Link
                            href="/thoughts"
                            className={cn("size-full block rounded-xl text-white", pathname !== "/thoughts" && "opacity-50")}
                        >
                            <Notebook size={32} weight="duotone" className="size-full p-2" />
                            <span className="tooltip">Thoughts</span>
                        </Link>
                    </li>
                    {/* Seperator */}
                    <li className="border-l border-white/10" onMouseMove={handleAppHover} />
                    <li className="app" onMouseMove={handleAppHover}>
                        <Link
                            href="https://twitter.com/CantBeSubh/" target="_blank"
                            className={cn("size-full block rounded-xl text-white", pathname !== "/thoughts" && "opacity-50")}
                        >
                            <TwitterLogo size={32} weight="duotone" className="size-full p-2" />
                            <span className="tooltip">Twitter</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Dock;
