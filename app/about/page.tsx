import { IsoValues } from "@/components/common/isovalues"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"


const AboutPage = () => {
    return (
        <div className='h-screen bg-neutral-950 text-white flex items-start justify-center'>
            <div className="size-full absolute inset-0">
                <IsoValues />
            </div>
            <div className="z-10 p-4 border-2 border-black rounded-lg backdrop-blur-3xl h-[85%] w-[95%] mt-12">
                {/* Bento Grid */}
                <div className="grid grid-cols-4 grid-rows-4 gap-4 p-4 h-full w-full">
                    <div className="col-span-2 row-span-2 backdrop-blur-3xl rounded-lg border-2 border-black flex items-center justify-center w-full h-full">
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
                    </div>
                    <div className="col-span-2 row-span-1 backdrop-blur-3xl rounded-lg border-2 border-black flex items-center justify-center w-full h-full">
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
                    </div>
                    <div className="col-span-2 row-span-1 backdrop-blur-3xl rounded-lg border-2 border-black flex items-center justify-center w-full h-full">Waka Time</div>
                    <div className="col-span-1 row-span-2 backdrop-blur-3xl rounded-lg border-2 border-black flex items-center justify-center w-full h-full">Fav Musics</div>
                    <div className="col-span-1 row-span-2 backdrop-blur-3xl rounded-lg border-2 border-black flex items-center justify-center w-full h-full">Fav Games</div>
                    <div className="col-span-1 row-span-2 backdrop-blur-3xl rounded-lg border-2 border-black flex items-center justify-center w-full h-full">Education</div>
                    <div className="col-span-1 row-span-2 backdrop-blur-3xl rounded-lg border-2 border-black flex items-center justify-center w-full h-full">Goals</div>
                </div>
            </div>
        </div>
    )
}

export default AboutPage