import Image from "next/image";

export const Ethica = () => {
    return (
        <div className="font-thin w-fit absolute top-4 right-4 z-[99] text-white p-1 bg-white rounded-lg">
            <Image
                src="/Logos/EthicaLogo.svg"
                width={30}
                height={30}
                alt="Ethica Logo"
            />
        </div>
    );
};