import { IsoValues } from "@/components/common/isovalues"
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"

const AboutPage = () => {
    return (
        <div className='h-screen bg-neutral-950 text-white flex items-start justify-center'>
            <div className="size-full absolute inset-0">
                <IsoValues />
            </div>
            <div className="z-10 p-4 border-2 border-black rounded-lg backdrop-blur-3xl h-[85%] w-[95%] mt-12">
                {/* Bento Grid */}
                <BentoGrid rows={4} cols={4}>
                    <BentoCard col={2} row={2}>About ME</BentoCard>
                    <BentoCard col={2}>Tech Stack</BentoCard>
                    <BentoCard col={2}>Waka Time</BentoCard>
                    <BentoCard row={2}>Fav Musics</BentoCard>
                    <BentoCard row={2}>Fav Games</BentoCard>
                    <BentoCard row={2}>Education</BentoCard>
                    <BentoCard row={2}>Goals</BentoCard>
                </BentoGrid>
            </div>
        </div>
    )
}

export default AboutPage