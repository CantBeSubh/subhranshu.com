import Dock from "@/components/common/dock";
import { Galaxy } from "@/components/common/galaxy";

export default function Home() {
  return (
    <div className='h-screen'>
      <Galaxy />
      <Dock />
    </div>
  )
}