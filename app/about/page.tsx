import { IsoValues } from "@/components/common/isovalues"
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
import Image from "next/image"
import Link from "next/link"

const AboutPage = () => {
    return (
        <div className='h-screen bg-neutral-950 text-white flex items-start justify-center'>
            <div className="size-full absolute inset-0">
                <IsoValues />
            </div>
            <div className="z-10 p-4 border-2 border-black rounded-lg backdrop-blur-3xl h-[85%] w-[95%] mt-12">
                {/* Bento Grid */}
                <BentoGrid rows={4} cols={4}>
                    <BentoCard col={2} row={2}>
                        <div className="flex p-2 bg-red-100 size-full">
                            {/* PFP */}
                            <div className="w-fit border-r border-black p-2 flex flex-col items-start justify-between">
                                <Image
                                    src="/Images/pfp.png"
                                    width={75}
                                    height={75}
                                    alt="PFP"
                                    className="rounded-full border-[0.5px] border-black"
                                />
                                <div className="text-xl font-bold">
                                    Subhranshu Pati
                                </div>
                                <div className="text-sm">
                                    Software Engineer
                                </div>
                                <Link href='/' className="underline">Read.cv</Link>
                            </div>
                            <div className="flex flex-col items-center justify-between">

                            </div>
                        </div>
                    </BentoCard>
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