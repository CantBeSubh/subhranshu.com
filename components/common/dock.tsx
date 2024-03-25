'use client'
import { scaleValue } from "@/components/utils/scale";
import { useRef } from "react";

const maxAdditionalSize = 5;

function Dock() {
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

    return (
        <div className="page">
            <nav ref={dockRef} className="dock">
                <ul>
                    <li className="app" onMouseMove={handleAppHover}>
                        <a href="https://www.frontend.fyi" target="_blank">
                            <img src="https://www.frontend.fyi/playground-assets/macos-dock/icons/arc.png" />
                            <span className="tooltip">Home</span>
                        </a>
                    </li>
                    <li className="app" onMouseMove={handleAppHover}>
                        <a href="https://www.frontend.fyi" target="_blank">
                            <img src="https://www.frontend.fyi/playground-assets/macos-dock/icons/1password.png" />
                            <span className="tooltip">About</span>
                        </a>
                    </li>
                    <li className="app" onMouseMove={handleAppHover}>
                        <a href="https://www.frontend.fyi" target="_blank">
                            <img src="https://www.frontend.fyi/playground-assets/macos-dock/icons/calendar.png" />
                            <span className="tooltip">Projects</span>
                        </a>
                    </li>
                    <li className="app" onMouseMove={handleAppHover}>
                        <a href="https://www.frontend.fyi" target="_blank">
                            <img src="https://www.frontend.fyi/playground-assets/macos-dock/icons/email.png" />
                            <span className="tooltip">Labs</span>
                        </a>
                    </li>
                    <li className="app" onMouseMove={handleAppHover}>
                        <a href="https://www.frontend.fyi" target="_blank">
                            <img src="https://www.frontend.fyi/playground-assets/macos-dock/icons/signal.png" />
                            <span className="tooltip">Blogs</span>
                        </a>
                    </li>
                    <li className="app" onMouseMove={handleAppHover}>
                        <a href="https://www.frontend.fyi" target="_blank">
                            <img src="https://www.frontend.fyi/playground-assets/macos-dock/icons/slack.png" />
                            <span className="tooltip">Thoughts</span>
                        </a>
                    </li>
                </ul>
            </nav>

            <div className="source-links">
                <a
                    href="https://unsplash.com/photos/4wzRuAb-KWs"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Wallpaper by Mohammad <br />
                    Alizade on Unsplash
                </a>
                <a
                    href="https://macosicons.com/#/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Icons by MacOS Icons
                </a>
            </div>
            <div className="mobile-message">
                <p>
                    What?! MacOS works on mobile?..
                    <br />— Unfortunately it doesn't 😢 Open this site on your desktop to
                    enjoy the amazing animations! Or watch the video{" "}
                    <a href="https://youtu.be/_ZcIFTvLm64" target="_blank">
                        on YouTube
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Dock;
