'use client';
import { SpeakerSimpleHigh, SpeakerSimpleX } from "@phosphor-icons/react/dist/ssr";

type SoundBtnProps = {
    handleAppHover: (ev: React.MouseEvent<HTMLLIElement>) => void,
    audio: HTMLAudioElement,
    isPlaying: boolean,
    setIsPlaying: (value: boolean) => void
}

export const SoundBtn = (props: SoundBtnProps) => {
    const { handleAppHover, audio, isPlaying, setIsPlaying } = props;

    return <li className="app" onMouseMove={handleAppHover}>
        <button
            onClick={() => {
                if (audio?.paused) {
                    audio.play();
                    setIsPlaying(true);
                }
                else {
                    audio?.pause();
                    setIsPlaying(false);
                }
            }}
            className="size-full block rounded-xl text-white"
        >
            {!isPlaying ?
                <SpeakerSimpleHigh size={32} weight="duotone" className="size-full p-2" />
                :
                <SpeakerSimpleX size={32} weight="duotone" className="size-full p-2" />}
            <span className="tooltip">Twitter</span>
        </button>
    </li>;
};
