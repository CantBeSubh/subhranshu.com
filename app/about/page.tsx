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
                        {/* TODO: Fix height issue */}
                        <div className="flex p-4 size-full justify-between">
                            {/* PFP */}
                            <div className="w-2/5 pl-2 flex flex-col items-start justify-between">
                                <div className="space-y-2 w-full">
                                    <Image
                                        src="/Images/pfp.png"
                                        width={100}
                                        height={100}
                                        alt="PFP"
                                        className="rounded-full border-[0.5px] border-black mb-4"
                                    />
                                    <div className="border-b border-neutral-300/40 border-[0.1px] w-[90%]" />
                                    <div className="">
                                        <div className="text-xl font-bold"> Subhranshu Pati </div>
                                        <div className="text-sm"> Software Engineer </div>
                                    </div>
                                </div>

                                <Link href='/' className="underline">Read.cv</Link>
                            </div>
                            <div className="w-3/5 text-sm">
                                I was born in a small town in western Germany, and I grew up in an ever-growing age of technology. My whole life, I was curious about how technology evolves and how it can enhance our everyday life.

                                A few years ago, I started to learn more about design. For me, it was important to bring my ideas to life, so I self-taught myself how to code and learned more about Design Engineering . In early 2023, I started my bachelor in Interaction Design at the University of Applied Sciences in Schwaebisch Gmuend.

                                Right now i am working at
                                zwoeins marketing
                                and I am always working on side projects to improve my skills and expand my knowledge in the field of software development.
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