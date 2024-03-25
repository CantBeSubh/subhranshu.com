import { Ethica } from "@/components/common/ethica";
import { Galaxy } from "@/components/common/galaxy";
import { Time } from "@/components/common/time";

export default function Home() {
  return (
    <div className='h-screen'>
      <Time />
      <Ethica />
      <Galaxy />
    </div>
  )
}