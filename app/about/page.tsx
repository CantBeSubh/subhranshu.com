import { IsoValues } from "@/components/common/isovalues"
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"

const AboutPage = () => {
    return (
        <div className='h-screen bg-neutral-950 text-white flex items-center justify-center'>
            <div className="size-full absolute inset-0">
                <IsoValues />
            </div>
            <div className="z-10 p-4 border-2 border-black rounded-lg backdrop-blur-3xl h-[80%] w-[90%]">
                {/* Bento Grid */}
                <BentoGrid rows={3} cols={4}>
                    <BentoCard col={2} row={2}>About ME</BentoCard>
                    <BentoCard>1</BentoCard>
                    <BentoCard>2</BentoCard>
                    <BentoCard>3</BentoCard>
                    <BentoCard>4</BentoCard>
                    <BentoCard col={2}>OKOK</BentoCard>
                    <BentoCard col={2}>OKOK</BentoCard>
                    <BentoCard>5</BentoCard>
                    <BentoCard>6</BentoCard>
                </BentoGrid>
            </div>
        </div>
    )
}

export default AboutPage