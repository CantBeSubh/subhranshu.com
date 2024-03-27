import { ArticleMedium, Browsers, Envelope, Flask, GithubLogo, House, LinkedinLogo, Notebook, TwitterLogo, User } from "@phosphor-icons/react/dist/ssr";

export const DOCK_LINKS = [
    {
        href: "/",
        tooltip: "Home",
        Icon: <House size={32} weight="duotone" className="size-full p-2" />,
    },
    {
        href: "/about",
        tooltip: "About",
        Icon: <User size={32} weight="duotone" className="size-full p-2" />,
    },
    {
        href: "/projects",
        tooltip: "Projects",
        Icon: <Browsers size={32} weight="duotone" className="size-full p-2" />,
    },
    {
        href: "/labs",
        tooltip: "Labs",
        Icon: <Flask size={32} weight="duotone" className="size-full p-2" />,
    },
    {
        href: "/blogs",
        tooltip: "Blogs",
        Icon: <ArticleMedium size={32} weight="duotone" className="size-full p-2" />,
    },
    {
        href: "/thoughts",
        tooltip: "Thoughts",
        Icon: <Notebook size={32} weight="duotone" className="size-full p-2" />,
    },
]

export const DOCK_SOCIALS = [
    {
        href: "https://twitter.com/CantBeSubh/",
        tooltip: "Twitter",
        Icon: <TwitterLogo size={32} weight="duotone" className="size-full p-2" />,
    },
    {
        href: "http://github.com/cantbesubh/",
        tooltip: "Github",
        Icon: <GithubLogo size={32} weight="duotone" className="size-full p-2" />,
    },
    {
        href: "mailto:socials.subhranshu@gmail.com",
        tooltip: "Email",
        Icon: <Envelope size={32} weight="duotone" className="size-full p-2" />,
    },
    {
        href: "https://www.linkedin.com/in/subhranshu-pati/",
        tooltip: "Linkedin",
        Icon: <LinkedinLogo size={32} weight="duotone" className="size-full p-2" />,
    }
]