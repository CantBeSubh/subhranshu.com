import { IsoValues } from "@/components/common/isovalues"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
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
                                    <Avatar className="size-40">
                                        <AvatarImage src="https://github.com/cantbesubh.png" />
                                        <AvatarFallback className="text-3xl">SP</AvatarFallback>
                                    </Avatar>
                                    <div className="border-b border-neutral-300/40 border-[0.1px] w-[90%]" />
                                    <div className="">
                                        <div className="text-xl font-bold"> Subhranshu Pati </div>
                                        <div className="text-sm"> Software Engineer </div>
                                    </div>
                                </div>

                                <Link href='/' className="underline">Read.cv</Link>
                            </div>

                            <div className="w-3/5 text-sm text-justify">
                                Hello there! I&apos;m Subhranshu, a creative fullstack developer and I build AI applications for fun. Currently navigating my early twenties, I&apos;m on an exciting journey to discover my path in life. At present, I work remotely as a Product Engineer for Ethica. I&apos;m delighted to collaborate with my dedicated and brilliant colleagues and managers right from my home. This environment continually inspires me to push boundaries and innovate. I&apos;m also immersed in several side projects, all of which you can explore in the Projects section. Feel free to join me on Twitter/X, where I regularly share updates and insights from my journey.
                                Let&apos;s connect and explore the endless possibilities together!
                            </div>
                        </div>
                    </BentoCard>
                    <BentoCard col={2}>
                        Tech Stack
                        {/* TODO CHECK ACTERNITY BADGES  */}
                        <Avatar>
                            <AvatarImage src="https://www.cdnlogo.com/logos/n/80/next-js.svg" />
                            <AvatarFallback>NJ</AvatarFallback>
                        </Avatar>
                        <Avatar className="rounded-sm">
                            <AvatarImage src="https://www.cdnlogo.com/logos/t/96/typescript.svg" />
                            <AvatarFallback>TS</AvatarFallback>
                        </Avatar>
                        <Avatar>
                            <AvatarImage src="https://supabase.com/dashboard/img/supabase-logo.svg" />
                            <AvatarFallback>SB</AvatarFallback>
                        </Avatar>
                    </BentoCard>
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