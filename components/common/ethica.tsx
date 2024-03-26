import Image from "next/image";
import Link from "next/link";

export const Ethica = () => {
    return (
        <Link
            href="https://www.heyethica.com/"
            className="font-thin w-fit absolute top-4 right-4 z-[99]"
        >
            <Image
                src="/Logos/EthicaLogo.svg"
                width={25}
                height={25}
                alt="Ethica Logo"
            />
        </Link>
    );
};