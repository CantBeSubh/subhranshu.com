'use client'
import { DockApp } from "@/components/dock/dock-app";
import { DockSeparator } from "@/components/dock/dock-separator";
import { SoundBtn } from "@/components/dock/sound-btn";
import { DOCK_LINKS, DOCK_SOCIALS } from "@/lib/constants/dock";
import { scaleValue } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const maxAdditionalSize = 5;

const Dock = () => {
    const [audio, setAudio] = useState<HTMLAudioElement>()
    const [isPlaying, setIsPlaying] = useState(false)

    const dockRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        setAudio(new Audio("/Audio/HeavenSent.mp3"))
    }, [])

    return (
        <div className="page">
            <nav ref={dockRef} className="dock">
                <ul>
                    {DOCK_LINKS.map(({ href, tooltip, Icon }) => (
                        <DockApp
                            key={href}
                            href={href}
                            handleAppHover={handleAppHover}
                            tooltip={tooltip}
                        >
                            {Icon}
                        </DockApp>
                    ))}

                    <DockSeparator handleAppHover={handleAppHover} />

                    {DOCK_SOCIALS.map(({ href, tooltip, Icon }) => (
                        <DockApp
                            key={href}
                            href={href}
                            handleAppHover={handleAppHover}
                            tooltip={tooltip}
                            isTargetBlank
                        >
                            {Icon}
                        </DockApp>
                    ))}

                    <DockSeparator handleAppHover={handleAppHover} />

                    <SoundBtn
                        handleAppHover={handleAppHover}
                        audio={audio!}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                    />
                </ul>
            </nav>
        </div>
    );
}

export default Dock;