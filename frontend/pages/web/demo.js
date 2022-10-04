import { useRouter } from 'next/router';
import Header from '../../src/components/Header';
import dynamic from 'next/dynamic';
const  Devices = dynamic(() => import("../../src/devices/Devices"), { ssr: false })

export default function Home() {
  const { isReady } = useRouter();
  return (
    <div>
      <Header />
      <main>
        {isReady && <Devices />}
      </main>
    </div>
  )
}
